

  export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: number;
  }

  export interface Order {
    id: number;
    userId: number;
    totalAmount: number;
    status: string;
  }
  
  export interface Payment {
    id: number;
    orderId: number;
    amount: number;
    paymentMethod: string;
    status: string;
  }
  
  export interface Review {
    id: number;
    productId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt: Date;
  }



  export interface UserSettings {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
  

  export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string; // user role or admin role
  }
  
  export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role?: string;  // Optional role field  use role or admin role
  }  
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface UpdateUserSettings {
    username?: string; // Optional for updates
    email?: string; // Optional for updates
    password?: string; // Optional for updates
    firstName?: string; // Optional for updates
    lastName?: string; // Optional for updates
    phoneNumber?: string; // Optional for updates
  }

  
  export interface UpdateUserRequest {
    username?: string; // Optional for updates
    email?: string; // Optional for updates
    password?: string; // Optional for updates
    firstName?: string; // Optional for updates
    lastName?: string; // Optional for updates
    phoneNumber?: string; // Optional for updates
  }

  export interface Address {
    id?: number; // Optional for responses
    userId: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }
  
  export interface Category {
    id?: number; // Optional for responses
    name: string;
  }

  export interface OrderItem {
    id?: number; // Optional for responses
    orderId: number;
    productId: number;
    quantity: number;
  }

  export interface ProductSize {
    id?: number; // Optional for responses
    productId: number;
    size: string;
    quantity: number;
  }
  
  