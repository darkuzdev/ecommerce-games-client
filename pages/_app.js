import React, { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";

//Components
import { ToastContainer, toast } from "react-toastify";

//Libraries
import jwtDecode from "jwt-decode";

//CSS Libraries
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//Main SASS File
import "../scss/main.scss";

//API Functions
import { getProductsCart, addProductCart } from "../api/cart";
import {
  setTokenToLocalStorage,
  getTokenOfLocalStorage,
  removeTokenOfLocalStorage,
} from "../api/token";

//Context
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";

export default function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState(undefined);
  const [reloadUser, setReloadUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getTokenOfLocalStorage();
    if (token) {
      setAuth({
        token,
        idUser: jwtDecode(token).id,
      });
    } else {
      setAuth(null);
    }

    setReloadUser(false);
  }, [reloadUser]);

  const login = (token) => {
    setTokenToLocalStorage(token);
    setAuth({
      token,
      idUser: jwtDecode(token).id,
    });
  };

  const logout = () => {
    if (auth) {
      removeTokenOfLocalStorage();
      setAuth(null);
      router.push("/");
    }
  };

  const authAddProduct = (product) => {
    if (auth) {
      addProductCart(product);
    } else {
      toast.warning("You have to log in or sign up to buy a game");
    }
  };

  const authData = useMemo(
    () => ({
      auth,
      login,
      logout,
      setReloadUser,
    }),
    [auth]
  );

  const cartData = useMemo(
    () => ({
      productsCart: 0,
      addProductCart: (product) => authAddProduct(product),
      getProductCart: () => getProductsCart,
      removeProductCart: () => null,
      removeAllProductsCart: () => null,
    }),
    []
  );

  if (auth === undefined) return null;

  return (
    <AuthContext.Provider value={authData}>
      <CartContext.Provider value={cartData}>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
