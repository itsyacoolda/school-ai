import { PermissionTier } from '../types';

export interface ContextDetectionResult {
  tier: PermissionTier;
  reason: string;
  evaluatedMessageCount: number;
  detectedIntent: 'academic' | 'project' | 'dev_max';
}

/**
 * Dynamically detects the appropriate hidden permission tier based on the context of the chat.
 * As per official guidelines:
 * - Teachers do NOT have a command (cmd) to adjust tokens.
 * - System tokens are determined strictly by the context of the chat after a few messages.
 * - Initial/default mode is always strict Socratic Academic Tutor (TIER_STU_ACADEMIC).
 */
export function detectPermissionTierFromChat(
  messages: { role: string; content: string }[]
): PermissionTier {
  const result = analyzeChatContext(messages);
  return result.tier;
}

export function analyzeChatContext(
  messages: { role: string; content: string }[]
): ContextDetectionResult {
  const userMessages = messages.filter((m) => m.role === 'user');
  
  // For brand new chats or prior to engaging in a few texts, default to strict Socratic tutoring
  if (userMessages.length === 0) {
    return {
      tier: 'TIER_STU_ACADEMIC',
      reason: 'Initial chat state: Strict Socratic Tutor active. Output permissions adapt after a few texts.',
      evaluatedMessageCount: 0,
      detectedIntent: 'academic',
    };
  }

  // Combine recent conversation texts (evaluating ongoing context across recent turns)
  const recentTexts = userMessages
    .slice(-5)
    .map((m) => m.content.toLowerCase())
    .join(' ');

  // 1. Unrestricted Software Engineering / Complete Code Signals (TIER_STU_DEV_MAX)
  const devMaxSignals = [
    'full code',
    'write a script',
    'write code',
    'complete code',
    'whole code',
    'write python code',
    'database schema',
    'sql schema',
    'sqlite',
    'postgresql',
    'fastapi',
    'express',
    'backend api',
    'rest api',
    'system architecture',
    'debug my code',
    'debug this code',
    'build an app',
    'build a project',
    'software engineering',
    'data structure implementation',
    'binary search tree code',
    'react component',
    'production script',
    'create a program',
    'write a python program',
    'write a script for',
    'write an algorithm in python',
    'full implementation',
    'git repository',
    'dockerfile',
    'crud application',
  ];

  // 2. STEM & Exhibition Coach Signals (TIER_STU_PROJECT)
  const projectSignals = [
    'arduino',
    'raspberry pi',
    'microcontroller',
    'esp32',
    'hc-sr04',
    'ultrasonic sensor',
    'sensor wiring',
    'circuit diagram',
    'breadboard',
    'relay module',
    'relay',
    'gpio',
    'science exhibition',
    'stem conclave',
    'science fair',
    'hardware prototype',
    'soil moisture sensor',
    'servo motor',
    'wiring schematic',
    'pull-up resistor',
    'voltage divider',
    'exhibition project',
    'working model',
    'robotics prototype',
    'iot prototype',
    'motor driver',
    'l298n',
    'solar tracker prototype',
    'smart dustbin',
    'water level indicator',
  ];

  const matchedDevSignal = devMaxSignals.find((signal) => recentTexts.includes(signal));
  const matchedProjectSignal = projectSignals.find((signal) => recentTexts.includes(signal));

  // Determine tier based on the context of the chat after texts
  if (matchedDevSignal) {
    return {
      tier: 'TIER_STU_DEV_MAX',
      reason: `Context Shift Detected: Software development intent found ("${matchedDevSignal}"). Unrestricted Development Partner permissions active.`,
      evaluatedMessageCount: userMessages.length,
      detectedIntent: 'dev_max',
    };
  }

  if (matchedProjectSignal) {
    return {
      tier: 'TIER_STU_PROJECT',
      reason: `Context Shift Detected: STEM prototype/exhibition intent found ("${matchedProjectSignal}"). Innovation & Hardware Coach permissions active.`,
      evaluatedMessageCount: userMessages.length,
      detectedIntent: 'project',
    };
  }

  return {
    tier: 'TIER_STU_ACADEMIC',
    reason: `Academic Tutoring Context: Socratic method active across ${userMessages.length} student queries. Step-by-step guidance without direct homework answers.`,
    evaluatedMessageCount: userMessages.length,
    detectedIntent: 'academic',
  };
}
