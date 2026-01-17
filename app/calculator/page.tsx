"use client"

import { useState } from "react"
import { Plus, Trash2, Calculator, IndianRupee, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ProductItem {
  id: string
  product: string
  price: number
  quantity: number
}

export default function CalculatorPage() {
  const [items, setItems] = useState<ProductItem[]>([{ id: "1", product: "", price: 0, quantity: 1 }])

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), product: "", price: 0, quantity: 1 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof ProductItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: field === "product" ? value : Number(value) || 0 } : item,
      ),
    )
  }

  const calculateItemTotal = (item: ProductItem) => item.price * item.quantity

  const grandTotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const clearAll = () => {
    setItems([{ id: "1", product: "", price: 0, quantity: 1 }])
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-sidebar px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-sidebar-foreground">Order Calculator</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Calculate your ATOMY order total easily. Add products, enter prices and quantities to get the final
              amount.
            </p>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" /> Product Calculator
                    </CardTitle>
                    <CardDescription>Add your products below to calculate the total order amount</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-muted-foreground px-2">
                    <div className="col-span-4">Product Name</div>
                    <div className="col-span-2 text-center">Price (₹)</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-3 text-center">Total (₹)</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Product Rows */}
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="sm:col-span-4">
                        <label className="text-xs text-muted-foreground sm:hidden mb-1 block">Product Name</label>
                        <Input
                          placeholder={`Product ${index + 1}`}
                          value={item.product}
                          onChange={(e) => updateItem(item.id, "product", e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-muted-foreground sm:hidden mb-1 block">Price (₹)</label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={item.price || ""}
                          onChange={(e) => updateItem(item.id, "price", e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-muted-foreground sm:hidden mb-1 block">Quantity</label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          value={item.quantity || ""}
                          onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-3 flex items-center justify-center">
                        <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                          <IndianRupee className="h-4 w-4" />
                          {calculateItemTotal(item).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="sm:col-span-1 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add Row Button */}
                  <Button variant="outline" onClick={addItem} className="w-full gap-2 border-dashed bg-transparent">
                    <Plus className="h-4 w-4" /> Add Another Product
                  </Button>

                  {/* Summary */}
                  <div className="mt-8 p-6 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-2xl font-bold text-foreground">{items.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Quantity</p>
                        <p className="text-2xl font-bold text-foreground">{totalQuantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Grand Total</p>
                        <p className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                          <IndianRupee className="h-6 w-6" />
                          {grandTotal.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="mt-6 border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" /> Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Enter the product name for your reference</li>
                  <li>• Input the unit price in Indian Rupees (₹)</li>
                  <li>• Set the quantity you need</li>
                  <li>• The total for each product is calculated automatically (Price × Quantity)</li>
                  <li>• Grand total shows the sum of all product totals</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
