import { Page } from "@playwright/test";

export const khsLocators = {
  sidebarKhsButton: (page: Page) => page.getByTestId("sidebar-khs"),
  // use data-testid explicitly to avoid ambiguous matches in the page
  khsHeader: (page: Page) => page.getByTestId("khs-header"),
  // menambah KHS
  addKhsButton: (page: Page) => page.getByTestId("add-khs-btn"),
  addKhsInformationHeader: (page: Page) => page.getByRole("heading", {
      name: "📌 Informasi Fitur Upload KHS/Transkrip ",
      level: 2,
    }),
  uploadKhsInput: (page: Page) => page.locator("input[type='file']#khsFile"),
  // after selecting a file the UI renders an element with data-testid="khs-file-name"
  // match by base filename (without extension) to tolerate UI spacing/formatting differences
  uploadedKhsFileName: (page: Page, filename: string) =>
    page
      .getByTestId("khs-file-name")
      .filter({ hasText: filename.replace(/\.[^/.]+$/, "") }),
  submitKhsButton: (page: Page) => page.getByRole("button", { name: "Kirim" }),
  verifySuccessUploadKhs: (page: Page) => page.getByText(/Dokumen berhasil diproses!/),
  verifyKhsDocumentOwner(page: Page, ownerName: string) {
    return page.locator("p", { hasText: ownerName });
  },
  // filter
  verifySearchFilterInput: (page: Page) => page.locator('input[type="search"]'),
  verifyFilteredData: (page: Page, search: string) => page.locator("td p", { hasText: search }), // DC
  verifySortFilter: (page: Page) => page.locator("#mata-kuliah-row"),
  // verifySortFilter: (page: Page, columnName: string) => page.locator("button.datatable-sorter", { hasText: columnName }), // lebih fleksibel
  sortButton: (page: Page, columnName: string) => page.getByRole("button", { name: columnName }),
  tableHeaders: (page: Page) => page.locator("thead th"),
  tableColumnCells: (page: Page, columnIndex: number) => page.locator(`tbody tr td:nth-child(${columnIndex + 1})`),
};
