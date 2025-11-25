'use client'

import Link from 'next/link'
import { useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import Layout from "../components/Layout";
import { NotificationService } from "../../utils/notifications";
import Breadcrumb from '../components/breadcrumb'
import SearchBar from '../components/searchbar'
import type { Product } from '@/models/product';
import type { Product_list } from '@/models/product_list';

export default function PageName() {
  const breadLinks = [
    { href: '/', label: 'Home' },
    { href: '/shoppingLists', label: 'My Shopping Lists' },
    { href: '/shopList', label: 'Shop List' },
  ]

  const user_products: Product[] = [
    { id: "1", user_id: "", name: "Arroz", is_predefined: false },
    { id: "2", user_id: "", name: "Leche", is_predefined: false },
    { id: "3", user_id: "", name: "Huevos", is_predefined: false },
    { id: "4", user_id: "", name: "Frijoles", is_predefined: false },
    { id: "5", user_id: "102", name: "Azúcar", is_predefined: false },
    { id: "6", user_id: "102", name: "Café", is_predefined: false }
  ];

  const list_asociate_products: Product_list[] = [
    { list_id: "5", product_id: "1", price: 1400, quantity: 2, unit: "kg", is_checked: false, added_at: "z" },
    { list_id: "5", product_id: "2", price: 1200, quantity: 2, unit: "l", is_checked: true, added_at: "z" },
    { list_id: "5", product_id: "3", price: 350, quantity: 10, unit: "", is_checked: true, added_at: "z" },
    { list_id: "5", product_id: "5", price: 2000, quantity: 1, unit: "kg", is_checked: false, added_at: "z" }
  ];

  //Estados para el renderizado automatico
  const [user_products_state] = useState<Product[]>(user_products);
  const [list_asociate_products_state, set_list_asociate_products_state] 
  = useState<Product_list[]>(list_asociate_products);

  //Mapeo de Productos, este se deberia hacer al entrar a la página
  const [product_map, set_product_map] = useState<Record<string, Product>>(
    () => Object.fromEntries(user_products.map(p => [p.id, p]))
  );

  const [not_list, set_not_list] = useState<Product[]>(() => {
    const assocIds = new Set(list_asociate_products.map(p => p.product_id));
    return user_products.filter(p => !assocIds.has(p.id));
  });

  //Función para eliminar y agregar a las listas respectivas
  function add_product(prod: Product, is_new: string) {

    set_not_list(prev => prev.filter(p => p.id !== prod.id));

    const new_assoc: Product_list = {
      list_id: "5",
      product_id: prod.id,
      price: 0,
      quantity: 1,
      unit: "",
      is_checked: false,
      added_at: "z"
    };

    set_list_asociate_products_state(prev => [...prev, new_assoc]);

    set_product_map(prev => ({
      ...prev,
      [prod.id]: prod
    }));
  }

  return (
    <Layout>
      <div className="min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full h-16 bg-white-800 rounded-lg flex items-center">
          <Breadcrumb breadLinks = {breadLinks}/>
        </div>

        <div className="w-full h-16 bg-gray-200 flex items-center">
          <h2 >ListName</h2>
          <div>
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
                        defaultValue={item.quantity}
                        className="text-center w-15"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        defaultValue={item.unit}
                        className="text-center w-15"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        defaultValue={item.price}
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
    </Layout>  
  )
}