import { sql } from "../../../lib/db";
import { NextResponse } from "next/server";

type CheckoutItem = {
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerName = String(
      body.customerName ?? ""
    ).trim();

    const phone = String(body.phone ?? "").trim();

    const address = String(body.address ?? "").trim();

    const payment = String(body.payment ?? "").trim();

    const notes = String(body.notes ?? "").trim();

    const products = body.products as CheckoutItem[];

    if (
      !customerName ||
      !phone ||
      !address ||
      !payment
    ) {
      return NextResponse.json(
        {
          error: "Data pelanggan belum lengkap",
        },
        {
          status: 400,
        }
      );
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        {
          error: "Keranjang masih kosong",
        },
        {
          status: 400,
        }
      );
    }

    const orderItems = [];

    for (const item of products) {
      const productId = Number(item.product.id);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(productId) || quantity < 1) {
        return NextResponse.json(
          {
            error: "Data produk tidak valid",
          },
          {
            status: 400,
          }
        );
      }

      const [product] = await sql`
        SELECT id, name, price
        FROM products
        WHERE id = ${productId}
      `;

      if (!product) {
        return NextResponse.json(
          {
            error: `Produk dengan ID ${productId} tidak ditemukan`,
          },
          {
            status: 404,
          }
        );
      }

      const price = Number(product.price);
      const subtotal = price * quantity;

      orderItems.push({
        productId: Number(product.id),
        productName: product.name,
        price,
        quantity,
        subtotal,
      });
    }

    const total = orderItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const [order] = await sql`
      INSERT INTO orders (
        customer_name,
        phone,
        address,
        payment_method,
        notes,
        total
      )
      VALUES (
        ${customerName},
        ${phone},
        ${address},
        ${payment},
        ${notes},
        ${total}
      )
      RETURNING id, total, status, created_at
    `;

    for (const item of orderItems) {
      await sql`
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          price,
          quantity,
          subtotal
        )
        VALUES (
          ${order.id},
          ${item.productId},
          ${item.productName},
          ${item.price},
          ${item.quantity},
          ${item.subtotal}
        )
      `;
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.created_at,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Gagal menyimpan pesanan:", error);

    return NextResponse.json(
      {
        error: "Gagal menyimpan pesanan ke database",
      },
      {
        status: 500,
      }
    );
  }
}