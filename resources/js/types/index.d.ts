import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    role?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
    phone: string;
    role: string;
}

export interface Invoice {
    id: string;
    total: number;
    status: 'pending' | 'waiting' | 'approved' | 'sending' | 'claimed' | 'rejected' | 'canceled';
    cart: Cart;
    address: Address;
    receipt: string;
    created_at: string;
    attachment?: string[] | string | null;
    rating?: number | null;
    comment?: string | null;
}

export interface Address {
    address_id: number;
    address_line: string;
    district: string;
    city: string;
    state: string;
    postal_code: string;
    phone_number: string;
}

export interface Cart {
    id: number;
    details: DetailCart[];
    user_id: number;
    user: User;
    subtotal: number;
    is_active: boolean;
}

export interface DetailCart {
    id: number;
    cart_id: number;
    product: Product;
    quantity: number;
    price: number;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    image: string;
    size: number;
    price: number;
    stock: number;
}

export interface CartForm {
    id: number;
    product_id: number;
    quantity: number;
}
