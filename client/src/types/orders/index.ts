import { ApiResponse } from "../shared";

export type OrderProduct = {
  product: string;   
  quantity: number;
};

export type Order = {
  id: string;
  user: string; 
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  paymentStatus: "pending" | "paid" | "failed";
  paymentId?: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export type generateRazorPayOrderIdPayload = {
  amount: number;
  currency?: string;
};

export type generateRazorPayOrderIdResponse = ApiResponse<{
  orderId: string;
  amount: number;
  currency: string;
}>;

export type createOrderPayload = {
  products: { product: string; quantity: number }[];
  totalAmount: number;
  shippingAddress: string;
  paymentStatus?: "pending" | "paid" | "failed";
  paymentId?: string;
};

export type createOrderResponse = ApiResponse<{ order: Order }>;

export type getOrdersResponse = ApiResponse<{ orders: Order[] }>;

export type getOrderAdminResponse = ApiResponse<{ orders: Order[] }>;

export type updateOrderStatusPayload = {
  id: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
};

export type updateOrderStatusResponse = ApiResponse<{ order: Order }>;

export type deleteOrderPayload = {
  id: string;
};

export type deleteOrderResponse = ApiResponse<{ success: boolean }>;
