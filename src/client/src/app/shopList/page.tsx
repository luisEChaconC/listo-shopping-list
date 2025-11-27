'use client'

import Link from 'next/link'
import { useState, useMemo, useRef } from "react";
import React, { useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import Layout from "../components/Layout";
import { NotificationService } from "../../utils/notifications";
import Breadcrumb from '../components/breadcrumb'
import SearchBar from '../components/searchbar'
import { Product } from './types'
import { Product_list } from './types'
import { getProducts, createProduct } from '../../api/products'
import { getListProducts } from "../../api/shop-list-products";
import { addProductToList, updateProductInList, deleteProductsFromList } from "../../api/shop-list-products";


export default function PageName() {
  const searchParams = useSearchParams();
  const currentListId = searchParams.get("id")!;

  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [listAssociatedProducts, setListAssociatedProducts] = useState<Product_list[]>([]);

  const deletedAssociatedProducts = useRef<Product_list[]>([]);
  const addedAssociatedProducts = useRef<Product_list[]>([]);


  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts();

      if (result.success && result.products) {
        setUserProducts(result.products);
      } else if (result.error) {
        NotificationService.showError("Error loading products", result.error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchListProducts = async () => {
      const result = await getListProducts(currentListId);

      if (result.success && result.items) {
        setListAssociatedProducts(
          result.items.map(item => ({
            ...item,
            price: item.price != null ? Number(item.price) : null,
            quantity: item.quantity != null ? Number(item.quantity) : null
          }))
        );
      } else if (result.error) {
        NotificationService.showError("Error loading list products", result.error);
      }
    };

    fetchListProducts();
  }, [currentListId]);

  const breadLinks = [
    { href: '/', label: 'Home' },
    { href: '/shopping-lists', label: 'My Shopping Lists' },
    { href: '/shopList', label: 'Shop List' }
  ];

  //Los Memo evitan que ocurra una cascada
  const productMap = useMemo(() => {
    const normalized = userProducts.map(p => ({
      ...p,
      userId: p.user_id ?? ''
    }));
    return Object.fromEntries(normalized.map(p => [p.id, p]));
  }, [userProducts]);

  const notList = useMemo(() => {
    const normalized = userProducts.map(p => ({
      ...p,
      userId: p.user_id ?? ''
    }));

    const assocIds = new Set(listAssociatedProducts.map(p => p.product_id));
    return normalized.filter(p => !assocIds.has(p.id));
  }, [userProducts, listAssociatedProducts]);

  const totalPrice = useMemo(() => {
    return listAssociatedProducts.reduce((sum, item) => {
      const price = item.price ?? 0;
      const quantity = item.quantity ?? 1;
      return sum + price * quantity;
    }, 0);
  }, [listAssociatedProducts]);

  async function addProduct(prod: Product, isNew: string) {
    if(isNew == "No"){
      const newAssoc: Product_list = {
        list_id: currentListId,
        product_id: prod.id,
        price: 0,
        quantity: 1,
        unit: "unit",
        is_checked: false,
        added_at: new Date()
      };
      setListAssociatedProducts(prev => [...prev, newAssoc]);
      
    } else {
      const result = await handleCreateProduct(isNew);
      if(result.id != ""){
        const newAssoc: Product_list = {
        list_id: currentListId,
        product_id: result.id,
        price: 0,
        quantity: 1,
        unit: "unit",
        is_checked: false,
        added_at: new Date()
      };
      setUserProducts(prev => [...prev, result]);
      setListAssociatedProducts(prev => [...prev, newAssoc]);
      addedAssociatedProducts.current.push(newAssoc);
      }
    }
  }

  function deleteProductFromList(product_id: string) {
    setListAssociatedProducts(prev => {
      const itemToDelete = prev.find(item => item.product_id === product_id);

      if (itemToDelete) {
        deletedAssociatedProducts.current.push(itemToDelete);
      }

      return prev.filter(item => item.product_id !== product_id);
    });
  }

  function updateItem(product_id: string, field: keyof Product_list, value: any) {
    setListAssociatedProducts(prev =>
      prev.map(item =>
        item.product_id === product_id
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  const handleCreateProduct = async (name: string) => {
    const result = await createProduct({ name })
    if (result.success && result.product) {
      NotificationService.showSuccess('Success!', `Product "${result.product.name}" created successfully`)
      return result.product;
    } else {
      NotificationService.showError('Error', result.error || 'Failed to create product')
      const emptyProduct: Product = {
        id: "",
        name: "",
        user_id: "",
        is_predefined: false
      }

      return emptyProduct;
    }
  }

  async function setChanges() {

    for (const item of addedAssociatedProducts.current) {
      await addProductToList(item);
    }

    for (const item of deletedAssociatedProducts.current) {
      await deleteProductsFromList(item.list_id, item.product_id);
    }

    try {
      for (const item of listAssociatedProducts) {
        const payload = {
          list_id: item.list_id,
          product_id: item.product_id,
          price: item.price != null ? Number(item.price) : null,
          quantity: item.quantity != null ? Number(item.quantity) : null,
          unit: item.unit ?? null,
          is_checked: item.is_checked ?? null,
          added_at: new Date(item.added_at)
        };

        await updateProductInList(payload);
      }

      NotificationService.showSuccess("Changes saved successfully");
    } catch (err) {
      NotificationService.showError(
        "Failed to save changes",
        err instanceof Error ? err.message : ""
      );
    }
  }

  return (
      <div className="min-h-screen items-center justify-center px-4 sm:px-6 lg:px-40">
        <h1 className="text-3xl font-bold text-gray-900 mt-11">
          Shop List
        </h1>
        <div className="w-full h-16 bg-white flex items-center">
          <Breadcrumb breadLinks={breadLinks}/>
        </div>

        <div className="w-full h-16 bg-white-200 flex items-center">
          <h2 ></h2>
          <div className="flex space-x-4">
            <button 
              className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setChanges()}
            >
            Save changes
            </button>
          </div>
          <div className="ml-auto">
            <SearchBar
              items={notList}
              onSelect={addProduct}
            />
          </div>
        </div>
        <div className="w-full min-w-[760px] flex justify-center">
          <div className="flex justify-center overflow-x-auto md:overflow-visible">
            <table className="table-fixed w-full text-center align-middle">
              <thead className="outline outline-1 rounded-lg overflow-hidden">
                <tr className='h-12'>
                  <th className="w-1/24"> </th>
                  <th className="w-1/3">Product</th>
                  <th className="w-1/12">Quantity</th>
                  <th className="w-1/12">Unit</th>
                  <th className="w-1/12">Price</th>
                  <th className="w-1/3"> </th>
                </tr>
              </thead>
              <tbody>
                {[...listAssociatedProducts].reverse().map((item, index) => (
                  <tr key={item.product_id} className={
                    index === listAssociatedProducts.length - 1
                    ? "h-14"
                    : "h-14 border-b-[1px]"
                  }>
                    <td className="text-left">
                      <input 
                        type="checkbox" 
                        className="rounded-full mx-6" 
                        defaultChecked={item.is_checked}
                        onChange={e => updateItem(item.product_id, "is_checked", e.target.checked)}
                      />
                    </td>

                    <td>{productMap[item.product_id]?.name ?? "??"}</td>

                    <td>
                      <input
                        type="number"
                        defaultValue={item.quantity ?? ""}
                        className="text-center w-15"
                        onChange={e => updateItem(item.product_id, "quantity", e.target.value === "" ? null : Number(e.target.value))}
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        defaultValue={item.unit ?? ""}
                        className="text-center w-15"
                        onChange={e => updateItem(item.product_id, "unit", e.target.value || null)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        defaultValue={item.price ?? ""}
                        className="text-center w-15"
                        onChange={e => updateItem(item.product_id, "price", e.target.value === "" ? null : Number(e.target.value))}
                      />
                    </td>

                    <td className="text-right">
                      <button className="bg-transparent hover:bg-gray-800 text-black-700 
                        font-semibold hover:text-white py-1 px-4 border border-black-500 
                        hover:border-transparent rounded mx-6" 
                        onClick={() => deleteProductFromList(item.product_id)}
                        >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full flex justify-end mt-6">
          <div className="bg-white rounded-lg px-6 py-4 text-right">
            <p className="text-sm text-gray-900">Total:</p>
            <p className="text-2xl font-bold text-gray-900">₡{totalPrice}</p>
          </div>
        </div>
      </div>
  )
}
