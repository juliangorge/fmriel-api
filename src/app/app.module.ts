import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "@/src/app/auth/auth.module";
import { DeathReportModule } from "@/src/contexts/deathReports/death-report.module";
import { PharmacyScheduleModule } from "@/src/contexts/pharmacySchedules/pharmacy-schedule.module";

import { HealthModule } from "@/app/health/health.module";

import { LoggerModule } from "@/shared/logger/logger.module";

import { PharmacyModule } from "@/contexts/pharmacies/pharmacy.module";
import { PostModule } from "@/contexts/posts/post.module";
import { PostSectionModule } from "@/contexts/postSections/post-section.module";
import { RainCityModule } from "@/contexts/rainCities/rain-city.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    AuthModule,
    HealthModule,
    PostModule,
    PostSectionModule,
    PharmacyModule,
    PharmacyScheduleModule,
    RainCityModule,
    DeathReportModule,
  ],
})
export class AppModule {}
