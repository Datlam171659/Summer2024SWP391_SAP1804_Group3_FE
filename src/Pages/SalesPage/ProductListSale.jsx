import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../Features/product/productSlice";
import { Button, Card, Col, Row, Input, Space } from "antd";
import "./SalesPage.scss";
import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from "../../Features/product/cartSlice";

const ProductListSale = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productData);
  const isLoadingProductData = useSelector(
    (state) => state.product.isLoadingProductData
  );
  const isError = useSelector((state) => state.product.isError);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(getTotals());
  };

  const handleDecreaseCart = (item) => {
    dispatch(decreaseCart(item));
    dispatch(getTotals());
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
    dispatch(getTotals());
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(getTotals());
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const categoryImages = {
    Ring: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDw8PDw8NDQ0NDw0NDQ0NDQ8NDQ0NFREWFhURFRUYHSggGBolHRUVITEhJSorLy4vFx81ODM4Oik5LisBCgoKDg0OFQ8PFS0fFRktKystKy0tLSstLS0tLS0rKystKy0rLS0rLSstLSstKy0rLSstLS0rLS0tLSstLS0rLf/AABEIAMkA+wMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAABAgADBAUG/8QAPBAAAgIBBAAEAgYIAwkAAAAAAQIAAxEEEiExE0FRYQUiFDJCcYGRBiNSYqGx0fBDwcIVJDNEY3KC4fH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/xAAeEQEBAQEBAAMBAQEAAAAAAAAAARECEgNBUTEhE//aAAwDAQACEQMRAD8A9Z9Fk+izq7JNk+f5erXJOlMU6YzrlIPDjyvpyPoxg+jmdjw4PCEeT05HgGKaTOz4IgNAjwenFNZimsztHTiIdMI8Hpxthk2Gdj6MIp0wk8HpxypilTO19FEVtII8HpxdstQY7nQOkE5+tXHUvk1RqTmavhtczaWosZ2tNTiVGtOo0Ahm2RhEWMssQ8x6ibPKY9RKErmzT9zFXNmnPMRK6GOIaYueI9M6sDbGpi2x6pQlsgktjAQMOJMSQ4nndi4k2wyQBtk2wyQJiDbGkhCFYNksggV7ICktkgU7ICkvxJiBlZJjv0e6dXEBWTFcyjSbZqCy8rFIjE0gkhIglBhEWESos8pi1BmsniYdSZaJWZroPMwVtNmnMQrog8S6iZweJdQZ1c1lsamJaY9UoW2EQWRhAwySSTzuqSQmLAMkgkgTEMEkCSSSQJDiAQwDBiWImfaAr+MuIrMEYiLmFAiKRGJgMgrYRTGaLCBJJJKCZg1J5m89TnaoxQiGbNO3M56Ga9MeYhXUB4l+nMyA8TRpjOsYX2GW1dSiwy6k8TSBZHESzuOIHPkghnmdkkkklEkkkgSEQSCAZJJIRIRBCIDZjK0SVtdhgMZPfIO3JyAC3AHPv6D7QmuZbciWyEfWVeKKTbStzKbBU1iK/hjt8E5x7xKbvFsNVLIzqMu24FKxtDYOPtYZSB6MD1LXsD0n6XpqPACuHFq1tlOT8oY/LxtPXl7zhj4pTo1rSpnSi6xjm6ll0wrJZ/BWzaAeye288jmd58U+3K916P6Fg2F7fCRCoQ2hNr5UEnIx5nGfY8TKW9wR5EHII9QfOZ7aNVqbNKw1BqWu83mqp1Nepq+bxK3BVvVQOeicYIzL7lNYrR1G8qSz1M1lJYY+ReMgBSDlsfjnMnfx/i89fpZIiPk42kEkAZZAGPB4IJ9fPEbnLrtdXQgbWXJYYySNuehnI8pz/wCfTXuDBAWGcZXOccMDg4Jx7dQgzN5s/q7KjdTm6szpNOZq5KsUKZq0x5mMTTpjzMxa6eeJo0pmMniaNKZ2jFabDL6DxMlpmjTniaZO55lglLnmWKeJRhkkknmdkhgkgGSSSUSGSGECSNiTEBZI22TECzT1ByQx2qFZmbO0gAevlOD8M+NW3UHVGkjTsbBp3rLjxdOQNlz+a9A8ZAB5weB09bR4lVtWQPFqsryc7RuUjnBBI55GYnwKwXV083UmlTRfRvWuqm2vCkAcYUjDDHaspHE9HxZjl8n9cT9MNXZs0xVtPdq72FardqaNOK3ZMjapYFicEYHfXoJy0/Rr4g9i0PWumXU11apy7tZTSKaqa22jna4YL8uembnGce8s+A0WNXbUEdqamqQpZssySMMbU+bcBux19Y/fPN/HtN8V+maOyty1dbWrqNHprNrVaZiiJZkn5iPmJI5yB2DidnNgPxBUuGk1FltW+56qmYf7zqmY7QyUockHgbuNoIyOzOmmnt0JtuZXXTIzWqu972rQgBjtX64A47PAPfc9X8N0rsEstsdmxlazWKzt7CuSu7PqOPMHMq+L22VAPuSwb+axWURUPA5zyc7R97DiTRz10QSsO5rKlXes1s7pYlmCOG3EnIXHftjnArrQ1JvsS3jGxtpVWzwx29ZAGc57/Gc+m9ql09C1qVrrsSraWFaVVlWWvAPQygGf2MjrE1VCwbtoZWCsqOwKrjJK+fWWz+Ld85B2qCqyVgvUedOKytYrCnBYYIJx7d5brOJZ4alsVlHFiLapQg5BwPx4KnPuJjUWKNpGNwC2AbTUyVrjgZO0YOMjnjriaFZWRTtBVfEbBwEDAYCgjokDoftCLNX+F3AjIOQRkEec5urnWZSAMqVbALAsGG4gE4OTxz5zl6yeTqZsdubrIJfpu5RL9P3MRqt7HiX6QzMx4l2kM6xlfaZp054mO4zTpjxNMnc8y1TxM1h5lyniVGUGHMqDQ7553ZZDmVb4d8ItEMrDxg0uGrAI6pKw0uVpqRNTZJtkayIbIw02IcSkvKbL22s65KpndtBbgD5gccg/VmuebUvWLrMklVxuAYkn7IHnjz5x/fEwIqViywlbWZq1sXcm57V45T6pIO7nGfLBxiTUXIa6yfEDCsm3NRcCvemaw2Dsz6j39px/0g07XafGlK0l3FviBEXCB9yZ63ApvBzkgk4zgid+eZy5W69zdrxT9HZlCDVWpQC2FILI7VqR0GLbV9y05Wu+MZY00q7XMLyiglWXwmXOcYJJJfH3Hqcq7S231VeJY7PUV4tLKCyP9fA9QBwMAggHM6LNawAcK7ICS4ba9pA63DB5x2Zr+Ii/pJafD4RNxYvVYdr7Gb5NhUZyFK8Y59pZZYbGDN0Os43N6Fv6TNpdMVO8JVSxHzeEXY5PYLMec/d5/jNG0zn31+Nc8/pgQAAMAAYAAwAPTiAmDwzClBJnLLW9kRh8pyMjk4M54BU76wTtZCVwPmRusg+Y/r6Ts6qrCYxnPy7f3TwT939ZksBqxg4dsMcdqAML/nPRzMmOVulcYHYOSTkY76JOB3xk/fjoTl6udV0ZuTnJ9e5jv0xnDuba68/xy8S7T9y/6IY9elM5zmtaZ+pdpDA2nMsooM6YzoXmaNMeJTbQZbTWcS4iWHmWq3EpsrOZYqHEoQUQ+AJr8GHwZzaY/CEPhia/BEPhCBkCCMFE0isRgglRnC+0YKfSalQRwolwYjWYPDM6GBMmuvFa54ySoAJx2QD/ADiTU1ivfDIpwEdirv8AMApAzjcOAeDwZX45VbClh8O0su8lLGz8qhawextHJ6Dbs55waBTutW5q1FL13VjhtjZJDsAMbiwOByeB6zljWWVCgKtjBtxNyUgqtxa3LnOMLj5c9nf58kd5Mc7dFtT/AIZKKAiZoDCq3cygMxVCSHJtUbsgZx6xRo95b9XUzW7ApShVZPlcbW3DgAkt6Z6HzSzR022WFSbcjeLWs+RjuGNykYyM5zxz5dz0Om061jA5JxubrOBj8B6CTrrCTWKnR7ck/MzY3dheOBheuBgfgJZtM3HEz2zla6QioY4pMNDS625UXcxwPL1J9BE/0qg1Y7mvRVZ5ALe4HH5+cmi0TWEWXDan2KfM+7/0/P0Ft1zXE10sUqUlLdQvByDg11H1HRbpeh8wO3rzzjFuudr9dWHITl1+V342oR2g9W9uh5+jc+hTdYSeRncx/kJTrirXmmhRtTFSKvQ29/hnPM7mj0wrQKOT2x/ab1l6uRJNVmkzLdUZ1CJkvnGukc/wzGrrMujVjmZilNZj01mXMOIaJtlRahj1IY98emBnsU5jgGNb3GXqA+6DdKpJz1tZvg8SVmKZFW+JD4kohEaNAsjh5QJYsqHLzDqrxllLKhK7RuBLHBy2Bg+RHGD2Jrfo/wDrucfVEkMGTZW+0C1Qu9lx8wAByPm8+uMzr8c+3PtlqdSrq5sRFRq6yqhUeshl7yGPLKOvsjk5hrtd8bPEDKppVCAEwODnnIXBHGR0I1NLj5V1CMxC7i2wIW5ICngjj78544wJv+H0bQWIwzknpQcZ89vmez3yTzOnXWTWZNq/T1KgO0AE43EZ5wMD+/v9ZcWMAEOJ59dkzDtzKdRqErG52Cgepmam5r+iaaj59W2D/SP4/dNc82s2yL3vw/h1jxbv2F6X3Y/ZE6eg+G7D4t7B7RyM8V1D0Uf5/wDyT4dXTUAlY+YgttXl29WP9T5zYNPuYNYdxX6iA/q0Pr+83uevLHOeskjFukuRrcrk109NglbLPbP2F/ifbGTy/jXxHw8aTSqDeyhQqABdPVjGTjheOh5fzfWfFntJp0eDj5bdWRmmr2T9t/4CHQaFKQQuWdzustc7rLG9WMW4mKfhPwpaF5Ia1vrv/pHt/ObysOYC0xWwKzDqFm4tMeoMzVjLiGruSSvuZitNnUXTSWdSaabZDUyzTdRNTH03UfYrv7jr1Ev7jL1AkkXdDmc20IgxDmCAMSAQwwCBLFlYlqwE1AJRscnBIHqR5Thq48Ufq6yStm4OGbwlIGQDj7R+bAxwPQceinB1mhIuLbl8Ng+N5bBYjG1scsMcAZ9PSdvjv059Rk+HVgksS7EPwzPkbAVynvz6Y74nd8VR9ofnmcL6Oa632MptO9i1e8B2BJQZY8ge4H4xU1eQCQVyM4YEH+M31z6ZnWOpr/jFFCGy2xK0HbuwRfzM5en/AEjOpbbpq7Ch/wAU1kA+6g4J/HEu0PwLTaq9bdTVZY9I/U1urKufNlDYGfeevo0O3hFrpXobAHfH3kYH5GSc8xfVrzdfwZyd9gQA8A2s1ljN+GB/4gfmeZt03wBmYFmdUHrwzfcnQ+9s+Y2+c6eq1Wn02XdhvxgsTvsPtk9D24E4ep/SC+47aB9Hr87WG61h7Dy/vma1MdzUarT6NcHhm5FaZe+1uh7nrGTOWzX6v/jfqNOf+Wrb9ZYP+q48v3R6zJp6VQlgGexvrWuS9jH3JnR01p9DOd6/Gpy21VKqhVAVVGFVQAAPYQkRBafSTxfYzOKbEGJPHHoRD4w6lAImS8TdkTNeJKRjxInccrIi8zDSxxxBpxLGHEFIm2VeoEfTjiG9YaRxL9im/uOvUlw5jKOJBmkzGgxObYZk3SERSJFOGjBpTHWBcplqGLXXCwxNItlNyAggjIPlFNsqsvl1GLUaA/YYf9rf1mFg1fa/k4x/Ob9RefKc96WfudJ1WLzFbfFwp4DkjoL6yz/beqcYUsgPmzFmlum+GjzmwUovmIvVXI51GgLNusJZvVjkj7vSdWmpFkDDyiF/aYVrZx5S7TtMJY46Mu01rekDphvaQt7SkWN6RvEPpNIYkekrZRG8Q+km+EVSq1jNRmS+KsKrxgZnjqeZlWtjxBTBniSmaQ10NMW6GmAt0K9QWwiBVsg2ywxSZhomINsbMBaQDZLK6pXvl9NkYNNa4iXiXKZTcJpGFlJMdNKTNVNc2ogl5ha5FmkAi+CBNusODMRs55m8YGyoEYlen+EjOST+M11Ms01NMtAuhRR1KLKwD1NztxOfc/MnRCWiHTyux41DTLTZDFDQgzTKSSQiVA2zPdXNUqshWTw4Qkui45kDbeIaRGxxJWJRLhBUJZYJKhKiq0SASywQAQKiINst2wYmGlRWIyS8iKRIrMyw19y0iBVkG2k8Q2CSocSPNskrM0q0zKJcJqJQ1KbhMGydHMosq8xNIxFDmMlpBjuplI47masbReCJmux6iQESi0zNagWQ0GVExqpnFblaOGmcExpplfvjK0oWWrKLMyqyWiVuIFWZFjYhCwHkSTEiCVDPCkDQpADiQCR4RAXEhEIgmVKRFIjGCRSEQoJDCkitSDiBhCkhmmS4jCKYwmolHEmIRDKKbEzMdtc6DTNdJSMWZVYZc8oMy0rdo9DRLIaYG1TLFlSy1JUWBYwEghgTMRzGMR4C5hUxZBAvzCkSFJUO0iiBoUgBoBC0ggf/2Q==",
    Earrings:
      "https://media.tiffany.com/is/image/Tiffany/EcomBrowseM/tiffany-lockearrings-72342860_1061463_ED.jpg?defaultImage=NoImageAvailableInternal&fmt=webp",
    Bracelet:
      "data:image/jpeg;base64,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",
    Pendant:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8HERUSBxAQFRUXFRIXFRESGQ8VFxUWFRcgFhUSFhYYHCggGxoxHRYWITUhJSkrLy46GSAzPTMsNyovLisBCgoKDQ0OFxAQFi0dHRkrListLTcrKys3LS0rKys3LSstKystKystKzctLSsrLSsrKzcrKy0rNy03LSs3Ky0rK//AABEIAIUAyAMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAgEEBgMFB//EADMQAAICAQIEAwcDAwUAAAAAAAABAhEDBDESIUFRIjJhBRNScYGRoRRCscHh8RUzU2Jy/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AP2IAFAAAAAANTNjlgk54Ld85w7+sezNsARhyrMrxv8At6PsyzUzYZYm56Vc/wB0Pj9fRnvgzRzq8fya6p9U/Ug9AAUAAAPPPmWCLlP/AC+iRcpKKuWy3ZrYV+pfHPZeRd18bXcDOlwtNzz+eXTpFLaKNkAAAAAAAAADMd0ZMR3QAwAAAAAAAAAABq6jTyi+PS0pdYvlGa9fX1NoAeOl1MdSrhaa5OL5OL7NHsauq0rm+PTPhyLr0kvhku38FaTVLUWpLhmvNB7r19V6kGwAaWqnLUy91gbX/JNftT/av+z/AAUYb/XyqP8AtxfN/HJft/8AK/JvE48axJRxqkuSSKAAAAAAAAAAADMd0BHdADAAAAAAAAAAAAAAaus0vv6lhfDkj5Z/zF94vsbROSXAm+yb+wHyn7Ycn7tYpRm/DbvgUu3FX1Po6XTrTR4Y/V9ZPrJnx+amm/M/Fbfg5O0qT/p036H3McuNJ90mSKoAFQAAAAAAAAAAGY7oCO6AGAAAAAAAAAAAAAAmclFNy2Sd/IoxKPEmpdU0BzixZffcdRWnptx8XvVcenOuGum/M6ONUuHauVduhzmHWxzZlp1bnDbJUlGSr49tmuXN7nRY48CSXRJfYkWqABUAAAAAAAAAABmO6AjugBihRVCgJoUVQoCaFFUKAmhRVCgJoUVQoCaPPUQc4SUN3F1865HtR4azUrSJOabtpKK3bfRfZgfAm45IKEPNsoK74l1re1Lr82dHFNJcW9K/n1Oe02SOnyvOo8U5prLGMfEox2+3JetnRYprNFSxu00mn3TVpki0oUVQoqJoUVQoCaFFUKAmhRVCgJoUVQoDEVzRkzFcwBdCi6FARQouhQEUKLoUBFCi6FARQouhQEcJz2ryrXTuDypXw42qriV3KvVqufKkfZ9qZ/02KcounVRe/ifKP5Oc0Otx6LInqHlbUfDCSbbyS6Lt1/NEqx549Dnx5c7y5W1D3fEktovm+C1v3vbofX9i6lcTx3laknPG5rlwqlKKl83dPnzNTSaqeknPJrVcci8cYqTcei+lWvU1tDq448kXjyyajk4ba8Hum+GKuuT2IOsoUXQo0iKFF0KAihRdCgIoUXQoCKFF0KAlIFUAMgAAAAAAAAAAAAPn+3Yylhl7rdOLvfhSduSXdLmc/ptdGDyY5y43NQljdOKk4Py3yT3T+518lxKmc7r/AGNNVFKWXGlUYLhTi9vry2ZKsTq5LFBvKlUWlPkvrS5Vv0NXS6n/AFCUpY5+fJaxSj5ocknz6UjQ0vsPimrxZZcpcafSXKku3XkjqfY/syWlUZal3JJpR5eFP16uiSD6oANIAAAAAAAAAAAAAAAAAAAAAAAAAAAecp/D+S2Twgeam+56wlxDgQUaAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z",
  };

  const filteredProducts = selectedCategory
    ? productData.filter(
        (item) =>
          item &&
          item.Tittle &&
          item.Tittle.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : productData;

  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const { Search } = Input;

  if (isError && !isLoadingProductData) {
    return <div>Something went wrong! Try again</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="my-9 w-full lg:w-2/3 p-4">
        <div className="flex justify-center mb-8">
          <Space direction="vertical">
            <Search
              placeholder="Search products"
              onSearch={onSearch}
              style={{ width: 600 }}
            />
          </Space>
        </div>
        <div className="category-section mb-8">
          <h1 className="text-2xl font-bold mb-4">Category</h1>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <div
                className="clear-btn bg-white text-gray-700 rounded-lg shadow-lg hover:bg-slate-200 hover:shadow-xl transition duration-200 mb-4 flex justify-around items-center p-4"
                onClick={() => handleCategoryClick("")}
              >
                <p className="text-lg font-semibold">All</p>
              </div>
            </Col>
            {["Ring", "Earrings", "Bracelet", "Pendant"].map((category) => (
              <Col span={6} key={category}>
                <div
                  className="clear-btn bg-white text-gray-700 rounded-lg shadow-lg hover:bg-slate-200 hover:shadow-xl transition duration-200 mb-4 flex justify-around items-center p-4"
                  onClick={() => handleCategoryClick(category)}
                >
                  <img
                    src={categoryImages[category]}
                    alt={category}
                    className="w-1/4 rounded-lg"
                  />
                  <p className="text-lg font-semibold">{category}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="product-card"
                cover={
                  <img
                    alt={item.Tittle}
                    src={item.itemImages}
                    className="object-cover h-48"
                  />
                }
              >
                <Card.Meta title={item.Tittle} className="text-center" />
                <Button
                  type="primary"
                  className="mt-4 w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/3 text-center p-6 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-4xl uppercase font-bold text-gray-800">Order</h1>
        </div>
        <div className="cart-items flex flex-col items-center space-y-8">
          {cart.cartItems &&
            cart.cartItems.map((cartItem) => (
              <div
                className="cart-item flex flex-col lg:flex-row items-center bg-white p-6 rounded-lg shadow-md w-full max-w-4xl"
                key={cartItem.id}
              >
                <div className="cart-product flex items-center space-x-6">
                  <img
                    src={cartItem.itemImages}
                    alt={cartItem.Title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {cartItem.Brand}
                    </h3>
                    <p className="text-gray-600 mt-2">{cartItem.Description}</p>
                    <button
                      onClick={() => handleRemoveFromCart(cartItem)}
                      className="mt-2 text-red-500 hover:text-red-700 transition duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex ml-0 lg:ml-10 items-center space-x-6 mt-6 lg:mt-0">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg p-2 space-x-3">
                    <button
                      onClick={() => handleDecreaseCart(cartItem)}
                      className="h-8 w-8 flex justify-center items-center text-xl bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
                    >
                      -
                    </button>
                    <div className="count w-8 text-center text-lg">
                      {cartItem.cartQuantity}
                    </div>
                    <button
                      onClick={() => handleAddToCart(cartItem)}
                      className="h-8 w-8 flex justify-center items-center text-xl bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-product-total-price text-xl font-semibold text-gray-800">
                    ${cartItem.Price * cartItem.cartQuantity}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="cart-summary mt-12 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <button
            className="clear-btn bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-200 mb-4"
            onClick={() => handleClearCart()}
          >
            Clear Cart
          </button>
          <div className="cart-checkout mt-6">
            <div className="subtotal flex justify-between items-center border-b pb-4 mb-4">
              <span className="text-lg font-semibold text-gray-800">
                Subtotal
              </span>
              <span className="amount text-xl font-bold text-gray-800">
                ${cart.cartTotalAmount}
              </span>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <button className="payment-btn bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200">
                Cash
              </button>
              <button className="payment-btn bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200">
                Debit
              </button>
              <button className="payment-btn bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200">
                E-Wallet
              </button>
            </div>
            <button className="bg-blue-500 text-white py-3 px-4 rounded-lg w-full hover:bg-blue-600 transition duration-200">
              Check out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListSale;
