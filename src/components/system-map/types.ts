export interface KumuElement {
  _id: string;
  attributes: {
    label?: string;
    'element type'?: string;
    description?: string;
    tags?: string[];
    'intervention type'?: string;
    'intervention type #2'?: string;
  };
}

export interface KumuConnection {
  _id: string;
  direction: string;
  delayed: boolean;
  reversed: boolean;
  attributes: {
    'connection type'?: string;
    tags?: string[];
    connection?: string;
  };
  from: string;
  to: string;
}

export interface KumuData {
  elements: KumuElement[];
  connections: KumuConnection[];
}
