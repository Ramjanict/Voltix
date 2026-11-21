import ApiSummary from "../src/BackendUrl/backendUrl";

const FetchCategoryWiseProduct = async (category: string) => {
  try {
    const fetchdata = await fetch(ApiSummary.categoryWiseProduct.url, {
      method: ApiSummary.categoryWiseProduct.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category: category,
      }),
    });

    if (!fetchdata.ok) {
      return { success: false, data: [] };
    }

    const responData = await fetchdata.json();
    return responData;
  } catch (error: any) {
    console.warn(`Failed to fetch category ${category}:`, error.message);
    return { success: false, data: [] };
  }
};

export default FetchCategoryWiseProduct;
