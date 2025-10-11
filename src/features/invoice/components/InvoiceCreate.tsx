import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomButton from "@/common/components/buttons/CustomButton";
import { toast } from "react-toastify";

// Invoice form validation schema
const invoiceSchema = z.object({
  invoiceType: z.string().min(1, "Invoice type is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  invoiceRefNo: z.string().min(1, "Invoice reference number is required"),
  scenarioId: z.string().min(1, "Scenario ID is required"),
  
  // Seller Information
  sellerNTNCNIC: z.string().min(1, "Seller NTN/CNIC is required"),
  sellerBusinessName: z.string().min(1, "Business name is required"),
  sellerProvince: z.string().min(1, "Province is required"),
  sellerAddress: z.string().min(1, "Address is required"),
  
  // Buyer Information
  buyerRegistrationType: z.string().min(1, "Registration type is required"),
  buyerNTNCNIC: z.string().min(1, "Buyer NTN/CNIC is required"),
  buyerBusinessName: z.string().min(1, "Business name is required"),
  buyerProvince: z.string().min(1, "Province is required"),
  buyerAddress: z.string().min(1, "Address is required"),
  
  // Invoice Items
  items: z.array(z.object({
    hsCode: z.string().min(1, "HS Code is required"),
    productDescription: z.string().optional(),
    rate: z.string().optional(),
    uoM: z.string().min(1, "UOM is required"),
    quantity: z.number().min(0, "Quantity must be positive"),
    valueSalesExcludingST: z.number().min(0, "Sales value must be positive"),
    salesTaxApplicable: z.number().optional(),
    furtherTax: z.number().optional(),
    fedPayable: z.number().optional(),
    discount: z.number().optional(),
    fixedNotifiedValueOrRetailPrice: z.number().optional(),
    saleType: z.string().min(1, "Sale type is required"),
    totalValues: z.number().optional(),
    salesTaxWithheldAtSource: z.number().optional(),
    extraTax: z.string().optional(),
    sroScheduleNo: z.string().optional(),
    sroItemSerialNo: z.string().optional(),
  })).min(1, "At least one item is required"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const InvoiceCreate: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceType: "Sale Invoice",
      scenarioId: "SN001",
      sellerProvince: "Punjab",
      buyerRegistrationType: "Registered",
      buyerProvince: "Punjab",
      saleType: "Goods at standard rate (default)",
      items: [{
        hsCode: "",
        productDescription: "",
        rate: "18%",
        uoM: "",
        quantity: 0,
        valueSalesExcludingST: 0,
        salesTaxApplicable: 0,
        furtherTax: 0,
        fedPayable: 0,
        discount: 0,
        fixedNotifiedValueOrRetailPrice: 0,
        saleType: "Goods at standard rate (default)",
        totalValues: 0,
        salesTaxWithheldAtSource: 0,
        extraTax: "",
        sroScheduleNo: "",
        sroItemSerialNo: "",
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Invoice data:", data);
      // Here you would typically send the data to your API
      toast.success("Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    append({
      hsCode: "",
      productDescription: "",
      rate: "18%",
      uoM: "",
      quantity: 0,
      valueSalesExcludingST: 0,
      salesTaxApplicable: 0,
      furtherTax: 0,
      fedPayable: 0,
      discount: 0,
      fixedNotifiedValueOrRetailPrice: 0,
      saleType: "Goods at standard rate (default)",
      totalValues: 0,
      salesTaxWithheldAtSource: 0,
      extraTax: "",
      sroScheduleNo: "",
      sroItemSerialNo: "",
    });
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Type
            </label>
            <select
              {...register("invoiceType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Sale Invoice">Sale Invoice</option>
              <option value="Credit Note">Credit Note</option>
            </select>
            {errors.invoiceType && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              {...register("invoiceDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.invoiceDate && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Ref No
            </label>
            <input
              type="text"
              {...register("invoiceRefNo")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.invoiceRefNo && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceRefNo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scenario ID
            </label>
            <input
              type="text"
              {...register("scenarioId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.scenarioId && (
              <p className="text-red-500 text-xs mt-1">{errors.scenarioId.message}</p>
            )}
          </div>
        </div>

        {/* Seller Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seller NTN/CNIC
              </label>
              <input
                type="text"
                {...register("sellerNTNCNIC")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.sellerNTNCNIC && (
                <p className="text-red-500 text-xs mt-1">{errors.sellerNTNCNIC.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                {...register("sellerBusinessName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.sellerBusinessName && (
                <p className="text-red-500 text-xs mt-1">{errors.sellerBusinessName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province
              </label>
              <select
                {...register("sellerProvince")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
              </select>
              {errors.sellerProvince && (
                <p className="text-red-500 text-xs mt-1">{errors.sellerProvince.message}</p>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                {...register("sellerAddress")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.sellerAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.sellerAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buyer Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Buyer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Type
              </label>
              <select
                {...register("buyerRegistrationType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Registered">Registered</option>
                <option value="Unregistered">Unregistered</option>
              </select>
              {errors.buyerRegistrationType && (
                <p className="text-red-500 text-xs mt-1">{errors.buyerRegistrationType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyer NTN/CNIC
              </label>
              <input
                type="text"
                {...register("buyerNTNCNIC")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.buyerNTNCNIC && (
                <p className="text-red-500 text-xs mt-1">{errors.buyerNTNCNIC.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                {...register("buyerBusinessName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.buyerBusinessName && (
                <p className="text-red-500 text-xs mt-1">{errors.buyerBusinessName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province
              </label>
              <select
                {...register("buyerProvince")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
              </select>
              {errors.buyerProvince && (
                <p className="text-red-500 text-xs mt-1">{errors.buyerProvince.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                {...register("buyerAddress")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.buyerAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.buyerAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Items</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Item {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Item
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HS Code
                  </label>
                  <select
                    {...register(`items.${index}.hsCode`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select HS Code --</option>
                    <option value="8432.1010">8432.1010 - [Ploughs]</option>
                    <option value="0304.7400">0304.7400 - [Frozen Fish Fillets]</option>
                  </select>
                  {errors.items?.[index]?.hsCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.items[index]?.hsCode?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Description
                  </label>
                  <input
                    type="text"
                    {...register(`items.${index}.productDescription`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate (%)
                  </label>
                  <input
                    type="text"
                    {...register(`items.${index}.rate`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UOM
                  </label>
                  <select
                    {...register(`items.${index}.uoM`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select UOM --</option>
                    <option value="U1000001">Kilogram</option>
                    <option value="U1000002">Square Meter</option>
                  </select>
                  {errors.items?.[index]?.uoM && (
                    <p className="text-red-500 text-xs mt-1">{errors.items[index]?.uoM?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Excl. ST
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.valueSalesExcludingST`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ST Applicable
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.salesTaxApplicable`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Further Tax
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.furtherTax`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FED Payable
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.fedPayable`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.discount`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fixed/Retail Price
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.fixedNotifiedValueOrRetailPrice`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Type
                  </label>
                  <select
                    {...register(`items.${index}.saleType`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Goods at standard rate (default)">Goods at standard rate (default)</option>
                    <option value="Zero-rated goods">Zero-rated goods</option>
                    <option value="Exempt goods">Exempt goods</option>
                  </select>
                  {errors.items?.[index]?.saleType && (
                    <p className="text-red-500 text-xs mt-1">{errors.items[index]?.saleType?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Values
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.totalValues`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Withheld
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.salesTaxWithheldAtSource`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extra Tax
                  </label>
                  <input
                    type="text"
                    {...register(`items.${index}.extraTax`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SRO No.
                  </label>
                  <select
                    {...register(`items.${index}.sroScheduleNo`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select SRO --</option>
                    <option value="SRO1125(I)/2011">SRO1125(I)/2011</option>
                    <option value="SRO1350(I)/2018">SRO1350(I)/2018</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SRO Serial No.
                  </label>
                  <select
                    {...register(`items.${index}.sroItemSerialNo`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select SRO Item --</option>
                    <option value="SROITEM001">SROITEM001</option>
                    <option value="SROITEM002">SROITEM002</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <CustomButton
              text="Add Item"
              variant="outlined"
              onClick={addItem}
              type="button"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6 flex justify-end">
          <CustomButton
            text={isSubmitting ? "Creating Invoice..." : "Submit Invoice"}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default InvoiceCreate;
