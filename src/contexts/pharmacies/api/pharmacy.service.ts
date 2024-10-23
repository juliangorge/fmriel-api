import { Injectable } from "@nestjs/common";

import { BaseService } from "@/src/contexts/base/api/base.service";

import { Pharmacy } from "./pharmacy.model";
import { PharmacyRepository } from "./pharmacy.repository";

@Injectable()
export class PharmacyService extends BaseService<Pharmacy> {
  constructor(protected readonly pharmacyRepository: PharmacyRepository) {
    super(pharmacyRepository);
  }

  async create(pharmacy: Pharmacy): Promise<Pharmacy> {
    return await this.pharmacyRepository.create(pharmacy);
  }

  async update(id: number, pharmacy: Pharmacy): Promise<Pharmacy> {
    return await this.pharmacyRepository.update(id, pharmacy);
  }
}
