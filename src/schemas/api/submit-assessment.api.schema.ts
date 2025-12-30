import { z } from "zod";

//Request schema
export const SubmitAssessmentSchema = z.object({
  high_risk_patients: z.array(z.string()).default([]),
  fever_patients: z.array(z.string()).default([]),
  data_quality_issues: z.array(z.string()).default([]),
});

export type SubmitAssessmentPayload = z.infer<typeof SubmitAssessmentSchema>;

//Response schema

//Alert score for high risk patients, fever patients and data quality issues
const AlertResponseBreakdownSchema = z.object({
  score: z.number(),
  max: z.number(),
  correct: z.number(),
  submitted: z.number(),
  matches: z.number(),
});

//Submission feedback
const SubmitAssessmentResponseFeedbackSchema = z.object({
  strengths: z.array(z.string()),
  issues: z.array(z.string()),
});

export const SubmitAssessmentResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  results: z.object({
    score: z.number(),
    percentage: z.number(),
    status: z.string(),
    breakdown: z.object({
      high_risk: AlertResponseBreakdownSchema,
      fever: AlertResponseBreakdownSchema,
      data_quality: AlertResponseBreakdownSchema,
    }),
    feedback: SubmitAssessmentResponseFeedbackSchema,
    attempt_number: z.number(),
    remaining_attempts: z.number(),
    is_personal_best: z.boolean(),
    can_resubmit: z.boolean(),
  }),
});

export type SubmitAssessmentResponse = z.infer<
  typeof SubmitAssessmentResponseSchema
>;
