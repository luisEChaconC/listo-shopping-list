'use client'

import Link from 'next/link'
import { useState, useMemo } from "react";
import React, { useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import Layout from "../components/Layout";
import { NotificationService } from "../../utils/notifications";
import Breadcrumb from '../components/breadcrumb'
import SearchBar from '../components/searchbar'
import { Product } from './types'
import { Product_list } from './types'
import { getProducts } from '../../api/products'
import { getListProducts } from "../../api/shop-list-products";


export default function PageName() {
  const searchParams = useSearchParams();
  const id_actual_list = searchParams.get("id")!;

  const [user_products_state, set_user_products_state] = useState<Product[]>([]);
  const [list_asociate_products_state, set_list_asociate_products_state] = useState<Product_list[]>([]);

  useEffect(() => { 
    const fetchProducts = async () => { 
      const result = await getProducts(); 
      
      if (result.success && result.products) { 
        set_user_products_state(result.products); 
      } else if (result.error) { 
        NotificationService.showError("Error loading products", result.error); 
      } 
    }; 
    
    fetchProducts(); 
  }, []);

  useEffect(() => {
    const fetchListProducts = async () => {
      const result = await getListProducts(id_actual_list);

      if (result.success && result.items) {
        set_list_asociate_products_state(result.items);
      } else if (result.error) {
        NotificationService.showError("Error loading list products", result.error);
      }
    };

    fetchListProducts();
  }, [id_actual_list]);

  const breadLinks = [
    { href: '/', label: 'Home' },
    { href: '/shopping-lists', label: 'My Shopping Lists' },
    { href: '/shopList', label: 'Shop List' }
  ];

  const product_map = useMemo(() => {
    const normalized = user_products_state.map(p => ({
      ...p,
      user_id: p.user_id ?? ''
    }));
    return Object.fromEntries(normalized.map(p => [p.id, p]));
  }, [user_products_state]);

  const not_list = useMemo(() => {
    const normalized = user_products_state.map(p => ({
      ...p,
      user_id: p.user_id ?? ''
    }));

    const assocIds = new Set(list_asociate_products_state.map(p => p.product_id));
    return normalized.filter(p => !assocIds.has(p.id));
  }, [user_products_state, list_asociate_products_state]);

  function add_product(prod: Product, is_new: string) {
    const new_assoc: Product_list = {
      list_id: id_actual_list,
      product_id: prod.id,
      price: 0,
      quantity: 1,
      unit: "",
      is_checked: false,
      added_at: new Date()
    };

    set_list_asociate_products_state(prev => [...prev, new_assoc]);
  }

  return (
      <div className="min-h-screen items-center justify-center px-4 sm:px-6 lg:px-16">
        <h1 className="text-3xl font-bold text-gray-900 mt-11 ml-10">
          Shop List
        </h1>
        <div className="w-full h-16 bg-white flex items-center ml-10">
          <Breadcrumb breadLinks = {breadLinks}/>
        </div>

        <div className="w-full h-16 bg-white-200 flex items-center">
          <h2 ></h2>
          <div className="ml-auto p-10">
            <SearchBar
              items={not_list}
              onSelect={add_product}
            />
          </div>
        </div>
        <div className="w-full h-full bg-green-00 rounded-lg flex justify-center">
          <table className="table-fixed w-11/12 text-center align-middle">
            <thead>
              <tr className='h-12 outline outline-1 overflow-hidden rounded-lg'>
                <th className="w-1/24"> </th>
                <th className="w-1/3">Product</th>
                <th className="w-1/12">Quantity</th>
                <th className="w-1/12">Unit</th>
                <th className="w-1/12">Price</th>
                <th className="w-1/3"> </th>
              </tr>
            </thead>
              <tbody>
                {[...list_asociate_products_state].reverse().map((item, index) => (
                  <tr key={index} className={
                    index === list_asociate_products_state.length - 1
                    ? "h-14"
                    : "h-14 border-b-[1px]"
                  }>
                    <td className="text-left">
                      <input 
                        type="checkbox" 
                        className="rounded-full mx-6" 
                        defaultChecked={item.is_checked}
                      />
                    </td>

                    <td>{product_map[item.product_id]?.name ?? "??"}</td>

                    <td>
                      <input
                        type="text"
                        defaultValue={item.quantity ?? ""}
                        className="text-center w-15"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        defaultValue={item.unit ?? ""}
                        className="text-center w-15"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        defaultValue={item.price ?? ""}
                        className="text-center w-15"
                      />
                    </td>

                    <td className="text-right">
                      <button className="bg-transparent hover:bg-gray-800 text-black-700 
                        font-semibold hover:text-white py-1 px-4 border border-black-500 
                        hover:border-transparent rounded mx-6">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>
  )
}