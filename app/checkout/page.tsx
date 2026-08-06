"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Product = {
  id: number;
  name: string;
  tag: string;
  price: number;
  image: string;
};

type CartGroup = {
  product: Product;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Transfer Bank");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("sha-bakery-cart");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error(
          "Gagal membaca keranjang:",
          error
        );

        setCart([]);
      }
    }

    setIsLoaded(true);
  }, []);

  const groupedCart = useMemo<CartGroup[]>(() => {
    const grouped = new Map<number, CartGroup>();

    cart.forEach((product) => {
      const existing = grouped.get(product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        grouped.set(product.id, {
          product,
          quantity: 1,
        });
      }
    });

    return Array.from(grouped.values());
  }, [cart]);

  const total = useMemo(() => {
    return groupedCart.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );
  }, [groupedCart]);

  async function submitOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }

    if (!name.trim()) {
      alert("Nama lengkap wajib diisi.");
      return;
    }

    if (!phone.trim()) {
      alert("Nomor WhatsApp wajib diisi.");
      return;
    }

    if (!address.trim()) {
      alert("Alamat pengiriman wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          payment,
          notes: notes.trim(),
          products: groupedCart,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Gagal menyimpan pesanan"
        );
      }

      localStorage.removeItem("sha-bakery-cart");

      setCart([]);
      setName("");
      setPhone("");
      setAddress("");
      setNotes("");

      alert(
        `Pesanan berhasil dibuat.\nNomor pesanan: ${result.orderId}`
      );
    } catch (error) {
      console.error("Checkout error:", error);

      alert(
        "Pesanan gagal disimpan. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoaded) {
    return (
      <main className="container" style={{ padding: "44px 0" }}>
        <p>Memuat checkout...</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "44px 0" }}>
      <div className="section-head">
        <div>
          <h1 className="page-title">Checkout</h1>

          <p>
            Isi data pembeli untuk menyelesaikan pesanan.
          </p>
        </div>

        <Link className="btn btn-secondary" href="/cart">
          ← Kembali ke Keranjang
        </Link>
      </div>

      {cart.length === 0 ? (
        <section className="panel">
          <div className="empty">
            <h3>Keranjang masih kosong</h3>

            <p>
              Silakan pilih produk terlebih dahulu.
            </p>

            <Link className="btn btn-primary" href="/">
              Lihat Produk
            </Link>
          </div>
        </section>
      ) : (
        <section className="cart-section">
          <div className="panel">
            <h3>Data Pembeli</h3>

            <form
              className="checkout-form"
              onSubmit={submitOrder}
              style={{ padding: "20px" }}
            >
              <label htmlFor="name">
                Nama lengkap
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Contoh: Siti Aminah"
                required
              />

              <label htmlFor="phone">
                Nomor WhatsApp
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="Contoh: 081234567890"
                required
              />

              <label htmlFor="address">
                Alamat pengiriman
              </label>

              <textarea
                id="address"
                name="address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Masukkan alamat lengkap"
                required
              />

              <label htmlFor="payment">
                Metode pembayaran
              </label>

              <select
                id="payment"
                name="payment"
                value={payment}
                onChange={(event) =>
                  setPayment(event.target.value)
                }
              >
                <option value="Transfer Bank">
                  Transfer Bank
                </option>

                <option value="COD">
                  COD
                </option>

                <option value="E-Wallet">
                  E-Wallet
                </option>
              </select>

              <label htmlFor="notes">
                Catatan pesanan
              </label>

              <textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Contoh: Tolong kirim sore hari"
              />

              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting
                  ? "Menyimpan Pesanan..."
                  : "Buat Pesanan"}
              </button>
            </form>
          </div>

          <aside className="panel">
            <h3>Ringkasan Pesanan</h3>

            <div className="summary">
              {groupedCart.map((item) => (
                <div
                  className="summary-row"
                  key={item.product.id}
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>

                  <span>
                    Rp
                    {(
                      item.product.price *
                      item.quantity
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}

              <hr />

              <div className="summary-row">
                <strong>Total Item</strong>
                <strong>{cart.length}</strong>
              </div>

              <div className="summary-row">
                <strong className="summary-total">
                  Total Pembayaran
                </strong>

                <strong className="summary-total">
                  Rp{total.toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}