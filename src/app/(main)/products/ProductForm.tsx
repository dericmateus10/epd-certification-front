// src/app/(main)/products/ProductForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProductResponse, UpdateProductDto } from '@/types/product.types';

// MUDANÇA AQUI: Schema atualizado para os novos nomes de campo
const formSchema = z.object({
  productCode: z.string().min(1, { message: 'The code is required.' }),
  productDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  productToEdit?: ProductResponse | null;
  onSuccess: () => void;
  onImport: (productCode: string) => Promise<void>;
  onUpdate: (id: string, data: UpdateProductDto) => Promise<void>;
}
export function ProductForm({ productToEdit, onSuccess, onImport, onUpdate }: ProductFormProps) {
  const isEditMode = !!productToEdit;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCode: '',
      productDescription: '',
    },
  });

  useEffect(() => {
    if (isEditMode && productToEdit) {
      
      form.reset({
        productCode: productToEdit.productCode,
        productDescription: productToEdit.productDescription || '',
      });
    } else {
      form.reset({ productCode: '', productDescription: '' });
    }
  }, [productToEdit, isEditMode, form]);

  async function onSubmit(values: ProductFormData) {
    try {
      if (isEditMode && productToEdit) {
        // MUDANÇA AQUI: Use a função recebida via props
        await onUpdate(productToEdit.id, {
          productDescription: values.productDescription,
        });
      } else {
        // MUDANÇA AQUI: Use a função recebida via props
        await onImport(values.productCode);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save material:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* MUDANÇA AQUI: Campo de código atualizado */}
        <FormField
          control={form.control}
          name="productCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter code to import"
                  {...field}
                  disabled={isEditMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MUDANÇA AQUI: Renderização condicional para o campo de descrição */}
        {isEditMode && (
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name / Description</FormLabel>
                <FormControl>
                  <Input placeholder="Material name and description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting 
              ? (isEditMode ? 'Saving...' : 'Importing...') 
              : (isEditMode ? 'Save Changes' : 'Import Material')}
          </Button>
        </div>
      </form>
    </Form>
  );
}