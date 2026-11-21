import { toast } from "react-toastify";
import ApiSummary from "../src/BackendUrl/backendUrl";

const AddToCard = async (e: React.SyntheticEvent | any, id: string) => {
  e?.stopPropagation?.();
  e?.preventDefault?.();
  try {
    const fetchData = await fetch(ApiSummary.addtocart.url, {
      method: ApiSummary.addtocart.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
      }),
    });
    const responseData = await fetchData.json();
    if (responseData.success) {
      toast.success(responseData.message || "Added to cart!");
    } else {
      toast.error(responseData.message || "Failed to add to cart");
    }
    return responseData;
  } catch (err: any) {
    console.error("AddToCart error:", err);
    toast.error("Network error while adding to cart");
    return { success: false, error: true };
  }
};

export default AddToCard;
