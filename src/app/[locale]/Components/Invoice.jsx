"use client";

import { useAuthContext } from "../Context/authContext";
import { useCartContext } from "../Context/cartContext";
import {
  copyright,
  formatDateString,
  freeShipping,
  siteLogo,
  siteLogoWhite,
} from "../Utils/variables";

export default function Invoice({ data }) {
  const { vat } = useCartContext();

  return (
    <table
      role="presentation"
      width="100%"
      cellSpacing="0"
      cellPadding="0"
      style={{ borderCollapse: "collapse", backgroundColor: "#fff" }}
    >
      <tbody
        style={{
          background: "white",
        }}
      >
        <tr
          style={{
            background: "white",
          }}
        >
          <td
            style={{
              backgroundColor: "#fff",
              color: "#fff",
              textAlign: "center",
              padding: "20px",
              fontSize: "28px",
              fontWeight: "600",
            }}
          >
            <img
              src="data:image/webp;base64,UklGRjAlAABXRUJQVlA4WAoAAAAQAAAAswAAQgAAQUxQSPYOAAAB8Mf//yol/v/dz4GhmyEkBIYOYcBOUETCWAMWUbATRdfWVWxx7aDW1jVZu14bbOhigq0buDYWFvZQM48/zjnPM8zGO/+IiAnA/xfJhQ+fk1u4dt7QcP4vYOwa2r7XgMwJ07Ozp00c1rupK/83ENHJvZNNf9euVj34fkapelLOPrsnK6nd88jEyQfOTPY0FM46MHbk4t2n7mtI9stTealBRn8p7tsbO29sepbzW/a96TWjXjbTh9WMnya68YDysQnAeUy9PN6iwczd2owoPHP/vZYa8O25qc5/IWctaamOaklDWtLQVD00/26YGYQiAIwnFUc1gMKl4+ziB9U6kq5//fLRnfLrF34+fPC7spsVL9+LEZFmu+ovE0Iy58lTl0VCXAoIPx+nJ77Z9O9f6Uj83dWjG6ePjm/l52EORoVnk7isbXe1AqKK5L9KpJwVsjqftIUe4FocJ48LHlP8moRvf143MSnYFsxGVq6+ISHBKldzDkKnnnu1RETaqX+ReDmb5UT95AW9wPF6MBsXNKuUiKiyeFFyABjNA7uMWbLjx99fVOtIvOZZ2VfjWlkA8NmpJSJNBNCCd/QLDzAxadO1W2BrzvsTtwguHI27AJ5mvo6+lp7NuNB23eK8w83cbXxTXQR95RyQYbkrFHpCi2IHKT5yyfk39LF0Sa9wJQ9xzqXL3K9L7926VrIvf17WwL59eiQmJCSlDJ+Z+5/y+uqbS50BpD4koiITfmfIsMzlE10aTemfGbyv5cSOMxcM7YCZa8yRbTP+kwxV1rddchrN9xu1fHhmUrqPUjBYzo8ysuZAb1g1Xswp5cS76op96SpTSHK2UVMPnvpmxbBoH6UlD9mcTdjiJ3RSCSCqiuils0Xe5wtmi7TtEz9t4ZQvhrhv5yzzVg3D6s+LemT4jl28dglmmIyaN3nRBO9u3QWT5ZSx2Z52YLLYyzEpjysB06gZj6rKcuOtIW3sHNh39pS0UAs0aKMDtAoAZhCRt+30lTGLlkzq1mxSq96zw9fM8RuD6XCaMmEpZtmMbb0gudfc0B8wzWT4XKvz0YNbZAoWyynnmEZOAvtosM9NM4o7UH99SgBYOb/2iU2UMEDVy0KBwz364G7m6M25ezRu5a60cnCChweUUAKBET7wgdI0LBQ+8IQXr/SAL3za2gpWyXlgyvS1rYwYGa3Kfn6xrgUPVlO/EAtjGKZbeZQA2+iSWa8M+7gMt2g09Y7s292lE5LcRyS0U4Z1HpmhSh/ebnC0oq2nw6Ak+5atfX3d1UNCBFvlPLFnMdkHdq49k9nwX56nG4HZzM/bFAZr7AnRuTQLq11jB5puykZ2dFZW8qhjIcXJ4xwXLRjqtwJwHxAycL5D/ufqNNdl4+YtTEgZCdHjcl4GsDTNkcGPYDBuuim/7fbOYFeY8jD8+a9c8VW/0S2xJhuzorO2TRi4cEH2oE0xn0/KlziwyqPgiDpNsXzc/NgFWbExMwQ/yqGjCoaBI2Vw3SVMQyeMVQJTJsj4axZNBfIzogonTE8fPK/lsGHo3yQnITOv+1SHrX5zAfe0gNQJmX7dkhfPTxgyFVvaz0/9HIDirCyayDB5jKu4uVgHcB4qlSo884uY4ODg4Ml5KieBnUqlUjkzmXmrVCpvR5VK5cNirFKpfBSAm0qlspFQzDZ1ULWJ9rftMCSwY1Cw0gZ2vKWFXWMXe/cmAc3sYGJpYuYUqgqK7BimCmuqCvf38zEDEFIjR7dlmonUjLuXxXenBcbGBsV0SOr6lmTqSjoCU4iIqsIYuEIdES3fTUQ001gqhYjq2sD3ERFNl4AR9hDRbaA/EdERS0j6PiaihQBMv3hNzLoHAwFFEclOBOO4oWDnhyGW5H+MRNRbIqLbdlLziYhumJcLdKlSC8Ra1rEBN8WWCmi9sUSrOjH+EMkfxSXWyUtlSZkmA12RoAc6wuGzD0REG23EerwhoiehEKEX7Q1KO0FW31o9PHWzaaORNZol4Es50ap5+nhsA2wT0HyR0IdERCMgQfdCDIneJco5SPqMgVe9rKks/DEZ3NSO3QR/lIiWVpW8I6JKJ8D1puBdDwAOJ4iIDpkw0I+mhkQP/dm4X4jow6kS6duCRKhIdg4L8sOYuKgJXGfBCIh22I7vJRCpISJ6GgSjQiKiMmuw0BEjQ6J73kx8CRHd4SE9XixKXgFT76UcCxT9wJYTy4LPBHRdOaKOiD5GgI1mGBQdtDWAdvJ2MJn87M9kdZoXObdbuKdi/+67AqXA9hsBnXhHRJQFqafPBR/TeMOouy+gbWYN10neUSYkFDI5PjKJFci9YyaAW4VAtMiY4VKyhojoY5Jh1KY8EdAUOXc93aVni/WUV8LG52Y03JtYEXSqkbjuBBYuW0dE9DjMMHwT3wqq0mVoPzDWivWXd40Nyu+iG4x2iWGJTuR9LJhgslNAl60NgxusIyKqaskmPxGD5d2XgaAL4Q12TsLkZ4FuJmTA9pyADi82CCjyBfR7zwaaLK9KDuxO9jdj6CxYHrPhRJd2olVEVCoBjwoium4pCz43BfTcMMAV6YiIHmsbZrE8nUIO7Dfn+cnI3r3VHuLP2VBMRFfM5CHspUBY17rhYFUmEJWov3Fd+rHYanlkJwuI3r+tmz3HcKUFL20gSKiWaiM2g2f8UxZ8y2Xd4SE9Xmy7Hnz0AEXzlb98s2TaqwmbRIoZ64jovAFgdr2c34oZq4noTza0/NBwx/UQoQ8AXKOoLt3iRglkbzUEfjVDxEfS41EZ6F/fYD/rIVpP4rH6qG9nCDA/JWV5Xw+6JDl8dkMZn9NDD0NbaGwQ8C2TwAiNvM2mcmBS1ECWv+oho0GiNXI/VGTzYDyq0WiKFFLXNRrNl1Lweq7RaG56A8i6qWH++DDHHkCORqO5ppSA3QWNRqPpCb5Yo9HsYRmr0Wgqwmxv62FUg1ir5YZbgtlXrVY3gnSYWq22Y4CvWq32htCqiZo1wgFCd7Va7QVGZ7VarebB+avVaiUYndVqdSDMMrLkjh0R2CD/7WsTFRUVFREeoOT1lPZlIWtBQUFBfn5BQUG+ZJ4wNzcvLy8vNzc3d+3adaXiZXq8oM+LDXlJ+rLsO3fv3v2pVFNdXa35+PbZtUNTW5uzeCWI9k0XZgwQDpQexDiYcYj0UMZh0sMZRzCOlB7FOFo6k3GMcJLk5MmTv9MR0b0nxFp9ykEqcvysf497NXVyb1VI6N5XfDOzNSfBh7b6NxscO2++cHpykAUauok1bMEa559lAma+8xf9IdvfEpY85JpDbuvGACx5AOBgBlGjCB7MFlEQGvVsFwcD93veM/5lIEPr2o+0msV74X362EKWfXlm+Ou2clJu2MloXJ0JeD3pA0Cxd+PFziK7frVky70psoaqP6bA3KBSaOcuasPgeePB81FS3MRKqtwQD9nt6eRq6ilmMlg9igNQ+sJZRjTtBbJpBICIt0RlnODBbVsmxRltpKB71Y2qqH5HbCU4PRgX+snppPtxCyUxwLT9LU8pt+dvsq2gxzC6uoQGiU3TamgSgGKNO8CvDZVqSRcdMZ6mAUCPdVl+EP5W4SBhN2JgAr6hPgK4Zf6mvEQ5Yq7bGsuLoyFymlZPX0p9wFlK8Bt1XuAcRSwv0VVOH561qybQaIEjF3j7m1tNjVywW+sFNNGNlWpGY4AhNFdg+tsqY5GLj5Viiu26ujft95JCxOHKXQR95yKWRxd5ESdeSk2FDANvPNppFPhm4Wzq732q7igvcDpB5I1pD1wFcC6jQiaLmd9fvfJthsfLjSNoAgDnpwmw500x4ZVVIfkCTnQY7TaX3ji70UNNE4DetEgwlOiEGT6bidNPlf67S/d0tUDTN1uPW2wme0G3KrpvxBWv4bj2meZw2pIMYavqGCnuSbERvNdZod+s6aSto7TGVUsn0oDC+mfUCYDp+ZoL5IsiGggoUoDwpzTOGICHb3DT1FExtfTxHR1RPto6gCYDiKv2gvAo9V9OAQBu31Z8R9qq+rqWwTQDiKPFAGwqrpTSeNvbT91PVrpdJiJ6d3WN7YR4FJAzANWbZ7/fV9hXVbmk19BuC3SYBS4lHVNonYj9AQ+jc09dcPQ3G/Pr5R/Wh6fWTfeomjWOBpS8OKZdBSBe900RBSOBVgDj6gKBkaTN5BFbueLJqsoFypwPryor1XYPVqWJfEoZIm3r1uZQi73e/M9vPdqV6P7UrjbzoWeXU2NEOtS2aFxRiGU06cfnHuXbul0mquwcUp+CXJ0ZgA31a8oqzLGa2l8rP0GdjUuL4PNiEhyen+QF7h9OnqulE7vfaA8eraH32w480P3yQ338eOozvZ5oK4BEIqLircdoDtCfbm4/8ry6svbQ3he6P+kW3dq27wPRwx3HatPTaDSAwHfvN49OHrbkTN3UnNqWVWdLaqjkq8tEtT9sv0BUVxlLcwC0qD9x7O1ihLxdvYsO335aRRU15Tt/o0u7Hl2GgIjq9m06p2l2/9V5unBc83xnCd3evv31N5zA4jDVll4mevyetL++Jap5T1R7TDH9laci6SDNA2A/+suFJ4m0fwQApteJ6NnsmJuke6F7q9HeryHt8+NXa0h3yn7wi5YAuEVvSFh9NWDlVbutVHfpFFHNr0eeEX2oqn1bnfwmCYDFBaJ7arStm9/5FVHN3ZX2X2tJ81xHlZ8KfBas++IBUfVX/JL3RKSr0FLNAx3R83SIOia0N7br8aljZGqshapHz6iwTmnxxmjzqSOa3KWWELdJSo+1AeD1pmxwgjug7NXDu1tEVHvLtuk9XGHWOjXBGs2HQMg1mfbVno0TIxTo0QH28bEKm67prRXwSchQf/JWuyo0C0KXQYO80K5cEwNVcnLTUDtYdspoYZOY4QNp716ftuDB++fT3njnNv3a2XbKSGwM9oKpf0aCfXDdg3raDGlu09ybGb2G3qI0/KVdw3hI29x6TLSJBwDna+fcoF//9IhpH1/7A/D8MafIauA3jZjafNDRLwo2xB86k2nC0Emjo8dPibbjbzRw3YnJJhD6nn/nrafeFUSangCwgrSUeZZymRC/ZnZbyFaAueeyRdGNU7pb/J0APCQd2kLfHmMWtoDQeNfgbLvGezzYwKHBOfzD8/jfkVZQOCAUFgAAsEsAnQEqtABDAAAAACUiIJC10T1p07vP/jx7OVOfoX3o/Iv4wf4D7QOtuK500favyU/1v//+sH9V/s35VfIf85f3f3AP0X/tf5Of47///CB7KP2Q9QH8s/on+p/vPvFf4D+iewj9Vf9h7gH8y/oHrR/6r2Ef7F/ivYA/kv9K9Wj/Gf8n/HfBB+xv/E/zXwGfyn+i/6z83P3/+wD0APUS/gHYIfzz8OP2O8Yf7R+On7heufhI8P+vn7gf5P4dsHc4H7j/bP2J/rX/d/1n3i/bf89+N3oH8Fv6j1Avyb+Of1j8dP7H/3/937lf9N2q9kvQF9R/lv98/sn66/3r9o/q2+O/5PoN9ev8x+RX0Afx7+Qf1j8lv75/7fqX/Xf6rxp/tH/H9gL+L/y3+5/4P9j/8P/7Pnx/qf87+03+Y///vr+i/9b/lP2i/yf///Aj+O/yr+4f2z/Kf5j+1//n6m/XD+x/sMfqAdms3BYT97+m8alimSVs+azGjYSW4F3Ii3ooCuWcqQ2wY7Fg2ZC7XA5Nflsr7srrMkRf0D0Ye1iKnXOY0mPYOS2cjABDl7Auv++BB8rpecyQF+f4P9e17/9/0bdPE796K2tw7yHQSNpN5Q6feeKQ1qyyj733ysEvwAc4em88yqeECedggnb+oitOr6RtJwcOwtk9dkTn6gWshIXb8RH0waqxQqq4rXfPsKPH4z8RrGnIcAIOTOhYxpcz5JS7bghiRoCbVMOrk3LeVjRtd6tYO3Cj76tzMAwQ73Z3z7J01R35lxSUEFxtzQMPVf2+jVw6Qa3bm/8in/yAywRRusbF6AAA/v4ovCblYLLQ98B8cSSDRHWWw5QK5C2toIEMvSzwZD4RcnoJZkz7gPEB0Uo1EE/spH3Buq+6gMmRE57QM82vIafmt4DsX6kAEI5EGOpvpyLyUdGjv5A/pBqpNMEHfWEh/3qtu1raQLmJP1PXm1FYuixOlHEPu+Yrv0jNfgXGCYsm2/v22q0awIQ//MlqWBCjoFUU/X/4JD77sQQoIc2XF6TvmFkh/dH/HutrYwI9GPNJD8sfkVaNzDgYsx1wHTNzRv76e6ILIXoD4L5HJm0Dn5D9Jwur/Rvim20GhYTD5LwRuDM3gLRD9JnfVlttlG2I1P7REiGfE3zlTRmNt/v8cR7ND2Ce5bHMG0+R7gyKbS35AKwxTqD9jFyhlQUDeO66zKokKWGQChVEwFqX+4nVE0I3lNC6PABcAr5vLsERzr15KvRA3q/lWXILzpKlUJH/g9Wnh46du7ncSdKgBkFkBk4rvgXGwRTaApzvWKEcnacIfEf7YkjxxueMK6+iIgTU2noEInemYjrddovR0D27lfnbkRANCpEC9w5cLCqSzj93cPQwccpfG4Dq0gWhG1ZHFIdYojBPKFD2O3uGXbXxK/gXdwFNgmzwHbhEfbAWPQkSFIG7MIfT7Ka40KPqvuNIypf0dqpIhTVgFm0hhtS8pV9NCjUcnhtruTCxQCW01DgvAHE5W7uNZjtzG6P3uIaYU1ZnbYDevro7+J4J4MuBt5fqo+On8SKA2R3+CmAbKjHAsRNq9gsfclOdpbyKver6N6IQPCSiKDaRQDbn8yGPbaSJOEKSRvWjhogMSo+Zinjkt/NvsJaLsXzB+KazIAT1L1tMD86W03g7/w0A/5QwlfWF1EoiQplEFoJzqZK6eFGXC30m2kRQIt0BCitT355ktsscR9EsiXbi2NihSWLFlfMvUHLBTrRQlvtImIu6Z0pK1z6hpH176TDI4CNDuW2l0uvLW+MhwBElD/aQrWqNz+mg6i4zLHtugYwkADsOwZBG2k/m6oJdiSwGkawetttLIhQxk3X/JmZP1FAAeMtkiM0t9+iZntyXhrW0DFyvx1XTNgAk8h6sn0eSbrA+c1R9lTo3Ef9buEOz6x0OnGZuBppHZjoQBE98yVQqZrYnaIwkO7/2bVZjz92qPlW0M7GUUi5rfc5osWsFyOf//1KjtlVUn+YBsm3JBHwvIHZ3OqrmgS2ueA0W60PDckpC60KgPUJPOGF0Cv7kY7ky3oj21g7ocPBMVMyG85rRNVf7kHPCzzlX+W8gv09a+Ia/IMZWSVb+uF7A5EYKzU0ywobf1OEf4uSBdy4LYajkizEW1KK+xSDT/W1Qqj6oo/DkWSu6dbJO8t/DOu2q5JHy3MX8DBnAboyffFOjqWt4fFk9MZFOZA5azEUOgB0C3s7hwIJoLeNjQkE1I/Xj223LsChbX15XjpiEifsgazsD5E8+/lh+ywrZRbgt6BurzByoY43lpkmqdrRzyJkY6WNmQTRPQmRv49nVIZmz8KG7X+9UX/++uHy3IQN29o2mGWslZ6YJbWPwQLDlsRo3i2JYwCMrMicdbapmnhD/2AsCdRLCxRsalAXJOT9mWbc5/QRm5+eUkt+xFjNy4VORBz2Zkjo7+srRSJ7i3oWXSiheqRYyLmeAzK9lsmVG85yq8ExO6Oik4m2PbgVwavDeo1tcv1qf2H+wjXb6DGHkhO+a6olZCb+BcVrKiKvEQjpgfL16e/7nclo80NYcl2uPK6wDrTxFy5WxHurrug1U77t2CMxwzasJqW6B01l3MqbKnRDzP7X0CAlF3ntlENA3iwj09Ry/+OFJAUXv8QYBLEQIBFinQGHPO58zNoJUWU020lGGel0KRrVblV8nteqcUdhzwa0XV91MdlKAvemhj+s+j+T/kV7CunSEKb2FmOpWsv7DhuVYc14QZUOkb3hcpUlVnKMJSJWX5tp8JpMvuJXZpMDH17GrYpESn9n3RDonkWgod+jWQhzuWIqLj8Jz+l5WjtddlPYnEPzlcYGLjS/Dvo/142BfemnoBl46er77PixyoWhUkXR1urJA+YZe88XLenZPaxfOrf1UPD3r9YpnQ/4lUD2Gn0mpP0cAijcfv/BLjEO7NZP7Tup/HUk4o/xTWpxeoLE6REb9soSfuWv9sZDX//M41sstCGKLra7JdlV3gFyhrfV3O6rI78VyrqbllpFgHRPC6rR3gW7EYTM6q6eS4jMUj3H5afGCB8eOqWpg9Kdy5ao2+oCjGx0ZYSjGQeYGjJA4imsf1ozxvmohZ9SSpxuW6gYbkMUSjpZKENLDWEdT32Sg/sGzzlLAp2XS92r94GEOpJsFgpqQrTr3pZKc0lJewp8ENneb3LJS6h4Zv3eGe0vhCx2WUfuiBX6p/ncS02o3uchpfwN/6AU1kwPZU0kcT1QPxJE7QzmK0yAntRKx4Z8R0NpIaBN+RctBGpteUkaxLX5z4Hc1KmK8h5efnS/kEUNYCw1OngHwCA5A7z/M3qA+R7T81Fjwysean77fk0UgCprXO3OM7bgXsqsnPUgTkiSQxyfAvyXDlfzUU+v6qK2kkjkgFzvqTn8wW5VQfxovtVQA1iGX5ishv8HxWpw7pMhIp5vzsySYgQ0Rf9WEKoryzVs7qFJlNdhDiOc8umwUCnovonuwi+3umDjq2JySpf2IC6kzXdk1lmV9t8fFUc75TlDmQWDL5px24rebpuTICiDEXiBWeSR1li8G8IIZqWmeF5syVUOBuroD2JVujYJgSqATDArkwtrK51cGZLCZxuHSVW1NHtj4i85CGPvf8+iL4Mi+g34L+cMRAeDveyXmy25puvmpPRCzMQSRZ4eZwEpoc1w22JPSPoOnHgfhxRRpMhBndR6gTzDbg8ucTNBpIqARq1aPZ1Fbnnw9Mrvff3erznmmk+yALl+bxSKQu76bZewSIjJICFQ2lN1C/B8SVrbP4n0cj8wTkLTdigX5DieTgoCZUJTHBl6ECE8F52e5BL1UanZPQWkv3hXmGzd78HikZzhnoqQ/B4EFCDYtQ3CWy+bLTuZGO/lUlqYUleE3oRYc29ry0J7US70Xsqzh84wxAVyqeyvLhU+yMGmwkJafyd/TfUTFNoD9VQLMun42eh7JRzC2OP3qPqmUnvB6NGCP81kb5+56s3Pfx/tg9bKXdQf+J2wX0KASu/mA0NQPHlE/iFvgmzgJcXWwn99fb9kp0AXBYiABCaxMP5+hsYBFuvHa1NOu3QjXmcgctTU9y/yj6YRfnvF1U5ubJWGs3PgdIlEeon5iKS/96yB0XW53DOUkZqYiKX/vBb8kqXySJ/zNXI1N/bTkWjRA3ATe3LTNO7pJVEfbiO42fhB0JRVNu9dxycu+zm07+v55mM7EkDAlp/5Rh5ecyF2FyWXh5rb0VstgxeZJEb8jojsF/wEn0/b/T6uvOEjqzmUi3xJ9YVoHpGGWkw/a13AQaQ9RFJrRL7QqaDtEDYME160llzmNdSCfo7pc/3f9pRICCo2emvhWurEog9TXpMetFTGP/5LxwHDfjYn+bMFBF73e8jX6qaMFswlEiFzQzH6nu7RLoQZjhQDNRxMzIvyXTs3YYPv/6zq+AzEvGayd7f05YST1iUxDdAxRCEx6CEAJuGgsfdEAFtfoPy3XYJDuhU0FUoM5DdKPoPeVhc0/zpbKl0aeu44WH4xAlEkShxcMonX4W19AiXtFHA/YZeigAKGJ3vLv/tHnFTg5taTWU631M7DEFQksDlK1tRNrF7dksc3KLyWj/YYXXeZ2tNyytxFJ+iKpYV9awJ5p3X/JiguAa4OMaO89D2Dj1UNlS1TW8uNMtUu6E4xw+gm1AkD5xIsxAhQhYoF+n6WyrXGTaRoJ9KlohzIA3aUaiimBSc/fkzCD/Yk+ENKFTPDBQgvH4k2s6r3X6VKfOg4Wke/8aa9vD1ty3F1NaxXED3uWPVhjx9Ul3ckaFxoHzK05NJQPaLkyImBMKfJLxOSs1BnnL3nY2gyxqm8DNL/8ARlXNaFPwKcYQVPv3bTZ7c3Zmnc8pllrxo8/4xk7rTgsVKkbTMjqZmQTDZnWTTxoXkOnQV+KGCsAR3cHTWeK7SZYxddr7K1fPC514WGs5cy/pIQoMpWYvr2qTP0b9rCPKHF9a/gMaO0Nt+121pXYmdsu/GLKYwXx5atm4J4M4Xmpwp16XEY1VeTOK67Sa6Nw5HPr8o6uHuVEqf2XxoNO6WYYx6QGiqNJ27kqpHB2SUpWfx/9+1TKUM3I327ekEE3jD7K9opGrumnC36D+bmvhSaL5WFfLIfaYqXBNiM0Yk9txSDy7nvW2NEf69lTUQMTa3EhwjEF81KDxj0GAfXq8gKWlteUsQvZpC8NKUq9G7zkOwsomKmirQKCh7qCt6koiOs3Yd6JMIJTro5nGGnjsZ6eyQ4iadrzpFLmNRWcuqWE+yWZCP0ErmaTZZa2F+Dbsa8jyMEuH+rP2N+sPw7f3awC4Emsu6mCvFTCUgfeWzedwqRQIAZbNcqm0epiEclKkLZVr89xU62UXL31Pqrjcot9A9IqDyPnvJJL7yyLpZ/QSUtVYTnzmfG++8feURK0qcOJaFP5Kgs7xofpaewLGZQNmS9+ioS1hN958wm5/VqklhhMl3F5+ptYLWHtpshOTDRZTZN9zxsjA1P3avd6m3sa5Sp/ULdOvaSvhMCkJDnpIgY8gPKAyJg0HFjE10N92w8g2wQoOPzANSYCskCxldeA06mKilarW26lyvuAcuIny9d2956GnsLi9ddH2d3UN82PbhKm/9/3ALjrm/3oHy41MoT5QfQgAmv3skRpD7Uxge8gcnGSRfFUyD4+ZuDkiGCT/fbO/WeRMbBERehKuzJHpE9RIsSCE0IbGpOeOwiSoJMwGOipdV5XBpPSkRlhBNOA+mU2ZTKWMDC/1Cj+x5yuH/uoluHb9AzLzw0zpBZ7qRYNYbINzd5dpwcMjhd0ayuIDEs4km6mNk/COBGP4cvzagghxfL9DFaWsNrmou8iXLxE1w7QJ2JdIo0sOWe9AWUCBo16Hs4w6wkaMQhV8QhTTGalwKY9kd1EnUsZYzy2G8DCS205V5inTS+UA7BgZkoKt5dmrK4qdr4isSxmZkWOqITs9/MEIJ0yu60i7emlmHAp1GS5qj56u2A/M0d+gD6X6gxCMQWFgnorhvoVBIt9q5B3fXz+Qslaw78+5SzHt6JmYNbu7YOrfJ1AOv6yReWHdO9iD/8M5fP1qvuIyf9/XDxQoX3HMNGBmXe1rLvgbDX8TL3r7VWyCzJvFAG6lV+2bApU2cMzYnP7/iQaEiHpajN07pztup1quXqX5h3i3DGlKwsz9iM+tcMWe/2Yw+KAWdyKH4xGxjHlfvXblYiKR/DhB//AyV8Gmx+lHqX+ZDPRKB0Tze3Gv/3EIiPMQKMA7jYKUgMj+KspL3j1IPoeEfkXu1y62Ph/aoB+zGlj5tCr4WQoAy9w6SwYB7WOGMzKZ7b0xOvjCxPBLDuEXGrmRyFCCE0nkyQVB0Y3xXppNfQT4jMplY/04UmIY4qSdsv2VVGaW4f3BapkBTIas6m/WizldFT7xQeC0/+DBmbENKKq3qdGb+aHnuJSJJt80tPowkIYHsPyEKM9/nAHxC9vw1y+uO/qb5Lz/l8+BbEFzzQvNZ97JeIwfSiF0Q0RFzCttlH2Gi+XpWNGwGGGRO7tFp9dbfV62Jfcpru+Ce99nTbtsMdbKI9//bqlfh0Hsdoqrit5sYXqt5cLLDgGBplzey7qfkmHeQOlOF7Tr73hbyaeN+hBzLRHBAEDpmO2KYjaKh4+9SU+m3/Y1I82WRhHdfmErzPnEwVTBTzMgJZyoMxA8An8/0ng66qhy9gvfmD23IGpJHUTnBmGQDIrXCslSgMKKiyAw6dQiJ83lja39mDStYVjQSJxiFduoDaBldIIfSfDDs+DlqKJkeQRdD711rXSaN7SXxDTklysrssRaSdVH/NHCchU4hL3Jh/eCqGmV3y+vDkHlNaBMrpfTA/GbCWe33VsV6lhUQx2swcy3PpM9GocKidOskuvnNOaybw0e6hMWMORDds1w/Nlg75Rav16SDVsH6CGCK7bf013MiPyb8kluDyYhu5LCkUKRAn/f9J/aZpNqYlfMy5fe/1ILHnYDSo543dpU8Mof6mGsZlJqRJs5nHHrVoXfX3GAvl7dkBMLWmFSkPxWSG4JWCYrgPuPWxTclAy1H3q2yMR/RV6gdlPOSZ43YbtDhuEf5drzIDUzrVqbHASyhnAIstFypTs6rJaqI2zoxOfbQHIE/htbEetZljiOY6QtaoYa32T9wffb2lBNS5ri2Fk9lFpdYGNyR0ZyqzkIa2SpwwABzCHrBaDw7zxyvDfYDGws5D0+C4QxnCo1u1q4S87kz3mENIY5JOYb98VQD2U1FaI20WWOHsCpEGfYerFmOeW6GZV+gKuAn96oTwFEdnR3PRq3ll16UaxdN0gTO6UY4iLbtQ2w+/HjLsrto+9EIELcAgHfvCBy+2UqrKuMXO47C1QmITv/5lqW/6mr3fNxaM8a89PCh2l2iBrBCh8H1bHdcf7A1VBr2WQwelMYuyNoPeEJ3phbWFUWgQ7Gdjz2zwirnMpjUV0S3ZF6Djyz5u38/ew0KEW8F/O29gDQZpx5uf0UjUAQH4wJrnl2Qe8TLbuI5oZQQ9oDLlH2/Pughm+DjKlAIFUg4+dyw1IQAAAAAAA"
              alt="Logo"
              height="100"
              width="200"
            />
          </td>
        </tr>

        <tr
          style={{
            background: "white",
          }}
        >
          <td style={{ padding: "20px", color: "#15181e" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                borderTop: "1px solid #dddddd",
                borderLeft: "1px solid #dddddd",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}
                    colSpan="2"
                  >
                    Order Details
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    background: "white",
                  }}
                >
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}
                  >
                    <b>Order ID:</b> {data?.id}
                    <br />
                    <b>Date Added:</b> {formatDateString(data?.date_created)}
                    <br />
                    <b>Payment Method:</b> {data?.payment_method_title}
                    <br />
                    <b>Shipping Method:</b>{" "}
                    {data?.shipping_lines &&
                    parseInt(data?.shipping_lines[0]?.total) !== 0 ? (
                      data?.shipping_lines && data?.shipping_lines[0]?.total
                    ) : (
                      <span className="text-primary">Free Shipping</span>
                    )}
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}
                  >
                    <b>E-mail:</b>{" "}
                    <a
                      href="mailto:upturnistuae@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data?.billing?.email}
                    </a>
                    <br />
                    <b>Telephone:</b> {data?.billing?.phone}
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
              }}
            >
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}
                  >
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
                    }}
                  >
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
              }}
            >
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}
                  >
                    Payment Address
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}
                  >
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
                    }}
                  >
                    {data?.billing?.first_name}, {data?.billing?.last_name}
                    <br />
                    {data?.billing?.address_1}
                    {data?.billing?.street}
                    <br />
                    {data?.billing?.city} - {data?.billing?.postcode}
                    <br />
                    {data?.billing?.state}
                    <br />
                    {data?.billing?.country}
                  </td>

                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "7px",
                    }}
                  >
                    {data?.billing?.first_name}, {data?.billing?.last_name}
                    <br />
                    {data?.billing?.address_1}
                    {data?.billing?.street}
                    <br />
                    {data?.billing?.city} - {data?.billing?.postcode}
                    <br />
                    {data?.billing?.state}
                    <br />
                    {data?.billing?.country}
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
              }}
            >
              <thead>
                <tr>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "left",
                      padding: "7px",
                      color: "#222222",
                    }}
                  >
                    Product
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "7px",
                      color: "#222222",
                    }}
                  >
                    Quantity
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "7px",
                      color: "#222222",
                    }}
                  >
                    Price
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      backgroundColor: "#fff",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "7px",
                      color: "#222222",
                    }}
                  >
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
                        }}
                      >
                        {item?.name}
                      </td>
                      <td
                        style={{
                          fontSize: "12px",
                          borderRight: "1px solid #dddddd",
                          borderBottom: "1px solid #dddddd",
                          textAlign: "right",
                          padding: "7px",
                        }}
                      >
                        {item?.quantity}
                      </td>
                      <td
                        style={{
                          fontSize: "12px",
                          borderRight: "1px solid #dddddd",
                          borderBottom: "1px solid #dddddd",
                          textAlign: "right",
                          padding: "7px",
                        }}
                      >
                        AED
                        {item?.subtotal / item?.quantity}
                      </td>

                      <td
                        style={{
                          fontSize: "12px",
                          borderRight: "1px solid #dddddd",
                          borderBottom: "1px solid #dddddd",
                          textAlign: "right",
                          padding: "7px",
                        }}
                      >
                        AED
                        {(item?.subtotal / item?.quantity) * item?.quantity}
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
                    colSpan="3"
                  >
                    <b>Sub-Total:</b>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                  >
                    AED
                    {data?.line_items?.reduce((acc, item) => {
                      const priceWithQuantity = item?.price * item?.quantity;
                      return acc + priceWithQuantity;
                    }, 0) + parseInt(data?.discount_total, 10)}
                    {/* AED {parseInt(data?.total)+parseInt(data?.discount_total)}  */}
                  </td>
                </tr>
                {data?.discount_total > 0 && (
                  <tr>
                    <td
                      style={{
                        fontSize: "12px",
                        borderRight: "1px solid #dddddd",
                        borderBottom: "1px solid #dddddd",
                        textAlign: "right",
                        padding: "7px",
                      }}
                      colSpan="3"
                    >
                      <b>Coupon discount:</b>
                    </td>
                    <td
                      style={{
                        fontSize: "12px",
                        borderRight: "1px solid #dddddd",
                        borderBottom: "1px solid #dddddd",
                        textAlign: "right",
                        padding: "7px",
                      }}
                    >
                      -AED
                      {data?.discount_total}
                    </td>
                  </tr>
                )}

                <tr
                  style={{
                    background: "white",
                  }}
                >
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                    colSpan="3"
                  >
                    <b>Shipping:</b>
                  </td>

                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                  >
                    <span
                      className={`${
                        data?.shipping_lines &&
                        data?.shipping_lines[0]?.method_id ===
                          "free_shipping" &&
                        "!text-green-600"
                      } val`}
                    >
                      {data?.shipping_lines &&
                      parseInt(data?.shipping_lines[0]?.total) !== 0 ? (
                        data?.shipping_lines && data?.shipping_lines[0]?.total
                      ) : (
                        <span className="text-primary">Free Shipping</span>
                      )}
                    </span>
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
                    colSpan="3"
                  >
                    <b>VAT({parseInt(vat?.rate)}%)</b>
                  </td>

                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                  >
                    AED
                    {/* {parseInt(vat?.rate).toFixed(2)} */}
                    {(
                      ((data?.line_items?.reduce((acc, item) => {
                        const priceWithQuantity = item?.price * item?.quantity;
                        return acc + priceWithQuantity;
                      }, 0) +
                        parseInt(data?.discount_total, 10)) *
                        parseInt(vat?.rate)) /
                      100
                    ).toFixed(2)}
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
                    colSpan="3"
                  >
                    <b>Total:</b>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      borderRight: "1px solid #dddddd",
                      borderBottom: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "7px",
                    }}
                  >
                    AED
                    {data?.shipping_lines &&
                    parseInt(data?.shipping_lines[0]?.total) !== 0
                      ? data?.shipping_lines &&
                        parseInt(
                          data?.total - data?.shipping_lines[0]?.total
                        ).toFixed(2)
                      : data?.shipping_lines &&
                        parseInt(
                          data?.total + data?.shipping_lines[0]?.total
                        ).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </td>
        </tr>

        <tr>
          <td
            style={{
              backgroundColor: "#fff",
              color: "#111",
              textAlign: "center",
              padding: "15px",
              fontSize: "14px",
            }}
          >
            <p style={{ margin: "0", fontSize:"12px" }}>{copyright}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
