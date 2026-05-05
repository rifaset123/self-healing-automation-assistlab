import { Page } from "@playwright/test";

export const khsLocators = {
  // navigasi
  sidebarKhsButton: (page: Page) => page.getByTestId("sidebarKhs"),
  khsHeader: (page: Page) => page.getByRole("heading", {
      name: "📤 KHS/Transkrip",
      level: 1,
    }),
    
  // menambah KHS
  addKhsButton: (page: Page) => page.getByTestId("add-khs-btn"),
  addKhsInformationHeader: (page: Page) => page.getByRole("heading", {
      name: "📌 Informasi Fitur Upload KHS/Transkrip ",
      level: 2,
    }),
  uploadKhsInput: (page: Page) => page.getByTestId("khs-file-upload"),
  uploadedKhsFileName: (page: Page, filename: string) => page.locator("p[x-text='file.name']").filter({ hasText: filename }),
  submitKhsButton: (page: Page) => page.getByRole("button", { name: "Kirim" }),
  verifySuccessUploadKhs: (page: Page) => page.getByText(/Dokumen berhasil diproses!/),
  verifyKhsDocumentOwner(page: Page, ownerName: string) {
    return page.locator("p", { hasText: ownerName });
  },
  
  // filter
  verifySearchFilterInput: (page: Page) => page.locator('input[type="search"]'),
  verifyFilteredData: (page: Page, search: string) => page.locator("td p", { hasText: search }), // DC
  verifySortFilter: (page: Page) => page.getByTestId("khs-subject-filter"),
  // verifySortFilter: (page: Page, columnName: string) => page.locator("button.datatable-sorter", { hasText: columnName }), // lebih fleksibel
  sortButton: (page: Page, columnName: string) => page.getByRole("button", { name: columnName }),
  tableHeaders: (page: Page) => page.locator("thead th"),
  tableColumnCells: (page: Page, columnIndex: number) => page.locator(`tbody tr td:nth-child(${columnIndex + 1})`),
};
