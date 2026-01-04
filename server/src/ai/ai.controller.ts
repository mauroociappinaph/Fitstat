import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { DailyLog, UserProfile, StrengthSet } from '../shared/types';

// DTOs simples para validar la entrada (idealmente usaríamos class-validator)
interface AuditRequestDto {
  log: DailyLog;
  profile: UserProfile;
  history: DailyLog[];
}

interface PredictRequestDto {
  profile: UserProfile;
  history: DailyLog[];
  strengthLogs: StrengthSet[];
}

interface ChatRequestDto {
  message: string;
  history: any[];
  contextSummary: string; // El cliente construye el resumen por ahora
}

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('audit')
  async auditDailyLog(@Body() body: AuditRequestDto) {
    this.logger.log(`Auditing log for date: ${body.log.date}`);
    return this.aiService.getDailyAuditFeedback(body.log, body.profile, body.history);
  }

  @Post('predict')
  async getPredictions(@Body() body: PredictRequestDto) {
    this.logger.log(`Generating predictions for user: ${body.profile.name}`);
    return this.aiService.getPredictions(body.profile, body.history);
  }

  @Post('chat')
  async chat(@Body() body: ChatRequestDto) {
    this.logger.log('Processing chat message');
    return { 
      response: await this.aiService.chat(body.message, body.history, body.contextSummary) 
    };
  }
}