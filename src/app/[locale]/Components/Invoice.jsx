"use client";

import { useAuthContext } from "../Context/authContext";


export default function Invoice({ data }) {


  const freeShipping = true
  const { userData } = useAuthContext();


  return (
    <table
      role="presentation"
      width="100%"
      cellSpacing="0"
      cellPadding="0"
      style={{ borderCollapse: "collapse", backgroundColor: "#fff" }}>
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: "#fff",
              color: "#fff",
              textAlign: "center",
              padding: "20px",
              fontSize: "28px",
              fontWeight: "600",
            }}>
            <img
              src="/images/logo.webp"
              alt="Logo"
              style={{ display: "block", height: "60px", width: "auto"}}
            />
          </td>
        </tr>

        <tr>
          <td style={{ padding: "20px", color: "#15181e" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                borderTop: "1px solid #dddddd",
                borderLeft: "1px solid #dddddd",
                marginBottom: "20px",
              }}>
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}
                    colSpan="2">
                    Order Details
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}>
                    <b>Order ID:</b> {data?.id}
                    <br />
                    <b>Date Added:</b> {data?.date_completed}
                    <br />
                    <b>Payment Method:</b> {data?.payment_method_title}
                    <br />
                    <b>Shipping Method:</b> {freeShipping && 'Free Shipping'}
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}>
                    <b>E-mail:</b>{" "}
                    <a
                      href="mailto:upturnistuae@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer">
                      {userData?.email}
                    </a>
                    <br />
                    <b>Telephone:</b>    {userData?.phone}
                    <br />
                    <b>Order Status:</b> {data?.status}
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                borderTop: "1px solid #dddddd",
                borderLeft: "1px solid #dddddd",
                marginBottom: "20px",
              }}>
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}>
                    Instructions
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}>
                    Payment Successful. {data?.payment_method_title}
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                borderTop: "1px solid #dddddd",
                borderLeft: "1px solid #dddddd",
                marginBottom: "20px",
              }}>
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}>
                    Payment Address
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}>
                    Shipping Address
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
               <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}>
                    {data?.shipping?.first_name}
                    <br />
                    {data?.shipping?.address_1}
                    <br />
                    <br />
                    {data?.shipping?.address_2}
                    <br />
                    {data?.shipping?.state}
                    <br />
                    {data?.shipping?.country}
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}>
                              {data?.shipping?.first_name}
                    <br />
                    {data?.shipping?.address_1}
                    <br />
                    <br />
                    {data?.shipping?.address_2}
                    <br />
                    {data?.shipping?.state}
                    <br />
                    {data?.shipping?.country}
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                borderTop: "1px solid #dddddd",
                borderLeft: "1px solid #dddddd",
                marginBottom: "20px",
              }}>
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}>
                    Product
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "7px",
                      color: "#222222",
                    }}>
                    Quantity
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "7px",
                      color: "#222222",
                    }}>
                    Price
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#efefef",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "7px",
                      color: "#222222",
                    }}>
                    Total
                  </td>
                </tr>
              </thead>
              <tbody>
            
              {data?.line_items &&
          data?.line_items.map((item, index) => (
            <tr key={index}>
            <td
              style={{
                fontSize: "12px",
                borderRight: "1px solid #dddddd",
                borderBottom: "1px solid #dddddd",
                textAlign: "left",
                padding: "7px",
              }}>
              {item?.name}
            </td>
            <td
              style={{
                fontSize: "12px",
                borderRight: "1px solid #dddddd",
                borderBottom: "1px solid #dddddd",
                textAlign: "right",
                padding: "7px",
              }}>
               {item?.quantity}
            </td>
            <td
              style={{
                fontSize: "12px",
                borderRight: "1px solid #dddddd",
                borderBottom: "1px solid #dddddd",
                textAlign: "right",
                padding: "7px",
              }}>
             {item?.subtotal/item?.quantity}
            </td>
          
            <td
              style={{
                fontSize: "12px",
                borderRight: "1px solid #dddddd",
                borderBottom: "1px solid #dddddd",
                textAlign: "right",
                padding: "7px",
              }}>
             {item?.subtotal/item?.quantity*item?.quantity}
            </td>
          </tr>
          ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                    colSpan="3">
                    <b>Sub-Total:</b>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}>
                  {parseInt(data?.total)+parseInt(data?.discount_total)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                    colSpan="3">
                    <b>Discount:</b>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}>
                    -{parseInt(data?.discount_total)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                    colSpan="3">
                    <b>Free Shipping:</b>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}>
                    {freeShipping && 'Free Shipping'}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                    colSpan="3">
                    <b>Total:</b>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}>
                    {data?.total}
                  </td>
                </tr>
              </tfoot>
            </table>
  </td>
        </tr>

        <tr>
          <td
            style={{
              backgroundColor: "#15181e",
              color: "#fff",
              textAlign: "center",
              padding: "15px",
              fontSize: "14px",
            }}>
            <p style={{ margin: "0" }}>wellness4u © 2024</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
