export interface Project {
  sNo: number;
  project: string;
  contractor: string;
  workProgress: number;
  targetProgress: number;
  site: string;
  contractSum: number;
  amountPaid: number;
  valueOfWorkDone: number;
  zone: string;
  category: string;
}

export const allProjects: Project[] = [
  {
    sNo: 1,
    project: "BLOCK A (G+5)",
    contractor: "HI-BIMS",
    workProgress: 79,
    targetProgress: 67,
    site: "ORCHID 1",
    contractSum: 109100135,
    amountPaid: 92465635,
    valueOfWorkDone: 95671133.4,
    zone: "LAGOS ZONE 1",
    category: "piling",
  },
  {
    sNo: 2,
    project: "BLOCK B (G+5)",
    contractor: "HI-BIMS",
    workProgress: 83,
    targetProgress: 71,
    site: "ORCHID 1",
    contractSum: 106486993.6,
    amountPaid: 84156213,
    valueOfWorkDone: 70691218.92,
    zone: "LAGOS ZONE 1",
    category: "piling",
  },
  // ... add other projects here
];
