export type ListicleInfo = {
  id: string;
  title: string;
};

export type ListicleEntry = {
  id: string;
  text: string;
};

export type Listicle = ListicleInfo & {
  entries: ListicleEntry[];
};
