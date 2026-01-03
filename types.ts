
export interface Companion {
  id: string;
  name: string;
}

export interface RSVPData {
  guestName: string;
  contactNumber: string;
  isAttending: boolean;
  companions: Companion[];
  message: string;
  timestamp: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
}
