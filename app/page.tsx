"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  tag: string;
  price: number;
  image: string;
};

const products: Product[] = [

  {
    id: 1,
    name: "Croissant Cokelat",
    tag: "Best Seller",
    price: 15000,
    image: "/assets/img/croissant.jpg",
  },
  {
    id: 2,
    name: "Cupcake",
    tag: "Favorit",
    price: 10000,
    image: "/assets/img/cupcake.jpg",
  },
  {
    id: 3,
    name: "Donut",
    tag: "Baru",
    price: 10000,
    image: "/assets/img/donut.jpg",
  },
  {
    id: 4,
    name: "Rollcake Vanilla",
    tag: "Premium",
    price: 30000,
    image: "/assets/img/rollcake.jpg",
  },
  {
    id: 5,
    name: "Roti Sobek",
    tag: "Favorit",
    price: 15000,
    image: "/assets/img/rotisobek.jpg",
  },
  {
    id: 6,
    name: "Strawberry Cake",
    tag: "Spesial",
    price: 150000,
    image: "/assets/img/strawberrycake.jpg",
  },

];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const savedCart = localStorage.getItem("sha-bakery-cart");

    if (!savedCart) return;

    try {
      const cart = JSON.parse(savedCart);

      if (Array.isArray(cart)) {
        setCartCount(cart.length);
      }
    } catch {
      setCartCount(0);
    }
  }, []);

  function addToCart(product: Product) {
    const savedCart = localStorage.getItem("sha-bakery-cart");

    let cart: Product[] = [];

    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch {
        cart = [];
      }
    }

    cart.push(product);

    localStorage.setItem(
      "sha-bakery-cart",
      JSON.stringify(cart)
    );

    setCartCount(cart.length);

    alert(`${product.name} ditambahkan ke keranjang.`);
  }

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div>Sha Bakery · Toko roti manis</div>
          <div>Keranjang & checkout responsif</div>
        </div>
      </div>

      <header>
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="brand-badge">S</span>
            Sha Bakery
          </Link>

          <button
            className="menu-btn"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰ Menu
          </button>

          <nav className={menuOpen ? "open" : ""}>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>

              <li>
                <a href="#products">Produk</a>
              </li>

              <li>
                <Link href="/cart">Keranjang</Link>
              </li>

              <li>
                <Link href="/checkout">Checkout</Link>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <Link className="cart-btn" href="/cart">
              🛒 <span>{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="hero">
        <div className="container hero-grid">
          <div className="hero-card">
            <span className="pill">
              Sha Bakery · Pink & Cream
            </span>

            <h1>
              Toko roti manis yang menyediakan berbagai macam
              kue dan roti lezat.
            </h1>

            <p className="lead">
              Roti, cake, dan pastry lezat untuk menemani hari
              spesialmu.
            </p>

            <div className="hero-cta">
              <a className="btn btn-primary" href="#products">
                Lihat Produk
              </a>

              <Link className="btn btn-secondary" href="/checkout">
                Pesan Sekarang
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <div className="parallax-wrap">
              <img
                src="/assets/img/toko.jpg"
                className="parallax-img popup-img"
                alt="Sha Bakery"
                onClick={() =>
                  setSelectedImage("/assets/img/toko.jpg")
                }
              />
            </div>
          </div>
        </div>
      </main>

      <section id="products">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Produk Terlaris</h2>
              <p>
                Pilih produk favoritmu lalu tambahkan ke keranjang.
              </p>
            </div>
          </div>

          <div className="products">
            {products.map((product) => (
              <article className="card" key={product.id}>
                <div className="parallax-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="parallax-img popup-img"
                    onClick={() =>
                      setSelectedImage(product.image)
                    }
                  />
                </div>

                <div className="card-body">
                  <span className="tag">{product.tag}</span>

                  <h3 style={{ margin: "12px 0 6px" }}>
                    {product.name}
                  </h3>

                  <div className="price-row">
                    <span className="price">
                      Rp
                      {product.price.toLocaleString("id-ID")}
                    </span>

                    <span className="small">/ pcs</span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    type="button"
                    onClick={() => addToCart(product)}
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <div
              className="brand"
              style={{ marginBottom: "14px" }}
            >
              <span className="brand-badge">S</span>
              Sha Bakery
            </div>

            <div className="socials">
              <a href="#">Instagram</a>
              <a href="#">WhatsApp</a>
              <a href="#">TikTok</a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Menu</h3>
            <Link href="/">Home</Link>
            <a href="#products">Produk</a>
            <Link href="/cart">Keranjang</Link>
            <Link href="/checkout">Checkout</Link>
          </div>

          <div className="footer-col">
            <h3>Kontak</h3>
            <p>Semarang, Jawa Tengah</p>
            <p>0813-9035-4558</p>
            <p>geisha@shabakery.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            © 2026 Sha Bakery. All rights reserved.
          </div>
        </div>
      </footer>

      <div
        className={selectedImage ? "img-modal show" : "img-modal"}
        onClick={() => setSelectedImage(null)}
      >
        <span
          className="close-modal"
          onClick={() => setSelectedImage(null)}
        >
          ×
        </span>

        {selectedImage && (
          <img
            className="modal-content"
            src={selectedImage}
            alt="Preview gambar"
            onClick={(event) => event.stopPropagation()}
          />
        )}
      </div>
    </>
  );
}