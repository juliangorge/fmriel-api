export interface DeathReport {
  id: number;
  name: string;
  surname: string;
  age: number;
  date_of_death: string;
  place_of_death?: string;
  funeral_location?: string;
  funeral_date?: string;
  photo_url?: string;
}
