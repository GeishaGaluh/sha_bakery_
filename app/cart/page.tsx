"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  tag: string;
  price: number;
  image: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("sha-bakery-cart");

    if (savedCart) {
      try {
        const data = JSON.parse(savedCart);

        if (Array.isArray(data)) {
          setCart(data);
        }
      } catch {
        setCart([]);
      }
    }

    setLoaded(true);
  }, []);

  function saveCart(newCart: Product[]) {
    setCart(newCart);

    localStorage.setItem(
      "sha-bakery-cart",
      JSON.stringify(newCart)
    );
  }

  function increase(product: Product) {
    saveCart([...cart, product]);
  }

  function decrease(productId: number) {
    const index = cart.findIndex(
      (product) => product.id === productId
    );

    if (index === -1) return;

    const newCart = [...cart];
    newCart.splice(index, 1);

    saveCart(newCart);
  }

  function removeProduct(productId: number) {
    saveCart(
      cart.filter((product) => product.id !== productId)
    );
  }

  function clearCart() {
    saveCart([]);
  }

  const groupedCart = useMemo(() => {
    const result = new Map<
      number,
      {
        product: Product;
        quantity: number;
      }
    >();

    cart.forEach((product) => {
      const existing = result.get(product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        result.set(product.id, {
          product,
          quantity: 1,
        });
      }
    });

    return Array.from(result.values());
  }, [cart]);

  const total = groupedCart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  if (!loaded) {
    return (
      <main className="container" style={{ padding: "44px 0" }}>
        <p>Memuat keranjang...</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "44px 0" }}>
      <div className="section-head">
        <div>
          <h1 className="page-title">
            Keranjang Belanja
          </h1>

          <p>Periksa kembali pesanan Anda.</p>
        </div>

        <Link className="btn btn-secondary" href="/">
          ← Kembali Belanja
        </Link>
      </div>

      {groupedCart.length === 0 ? (
        <section className="panel">
          <div className="empty">
            <h3>Keranjang masih kosong</h3>

            <p>Silakan pilih produk terlebih dahulu.</p>

            <Link className="btn btn-primary" href="/">
              Lihat Produk
            </Link>
          </div>
        </section>
      ) : (
        <section className="cart-section">
          <div className="panel">
            <h3>Produk Pesanan</h3>

            <div className="cart-list">
              {groupedCart.map((item) => (
                <div
                  className="cart-item"
                  key={item.product.id}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                  />

                  <div>
                    <h3>{item.product.name}</h3>

                    <p>
                      Rp
                      {item.product.price.toLocaleString(
                        "id-ID"
                      )}
                    </p>

                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() =>
                        removeProduct(item.product.id)
                      }
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="qty">
                    <button
                      type="button"
                      onClick={() =>
                        decrease(item.product.id)
                      }
                    >
                      −
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      type="button"
                      onClick={() => increase(item.product)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "0 20px 20px" }}>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={clearCart}
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>

          <aside className="panel">
            <h3>Ringkasan Pesanan</h3>

            <div className="summary">
              <div className="summary-row">
                <span>Total item</span>
                <span>{cart.length}</span>
              </div>

              <div className="summary-row">
                <span>Total harga</span>

                <strong className="summary-total">
                  Rp{total.toLocaleString("id-ID")}
                </strong>
              </div>

              <Link
                className="btn btn-primary"
                href="/checkout"
                style={{
                  width: "100%",
                  marginTop: "14px",
                }}
              >
                Lanjut Checkout
              </Link>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}