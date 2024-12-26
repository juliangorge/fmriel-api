export interface DeathReport {
  id: number;
  name: string;
  surname: string;
  age: number;
  date_of_death: Date;
  place_of_death?: string;
  funeral_location?: string;
  funeral_date?: Date;
  photo_url?: string;
}
