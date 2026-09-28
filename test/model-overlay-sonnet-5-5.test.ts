/** Sonnet 5.5 routing and overlay assertions. */
import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { ALL_MODEL_NAMES, resolveModel, validateModel } from '../scripts/models';
import type { TemplateContext } from '../scripts/resolvers/types';
import { HOST_PATHS } from '../scripts/resolvers/types';
import { generateModelOverlay } from '../scripts/resolvers/model-overlay';

function makeCtx(model: string): TemplateContext {
  return {
    skillName: 'test-skill',
    tmplPath: 'test.tmpl',
    host: 'claude',
    paths: HOST_PATHS.claude,
    preambleTier: 2,
    model,
  };
}

const ROOT = path.resolve(__dirname, '..');

describe('Sonnet 5.5 model routing', () => {
  test('resolves the overlay name and exact API model ID', () => {
    expect(resolveModel('sonnet-5-5')).toBe('sonnet-5-5');
    expect(resolveModel('claude-sonnet-5-5')).toBe('sonnet-5-5');
    expect(resolveModel('  claude-sonnet-5-5  ')).toBe('sonnet-5-5');
    expect(resolveModel('claude-sonnet-5-5-20260928')).toBe('sonnet-5-5');
  });

  test('retires the Sonnet 5 selector without relabeling older models', () => {
    expect(ALL_MODEL_NAMES).not.toContain('sonnet-5');
    expect(validateModel('sonnet-5')).not.toBeNull();
    expect(validateModel('sonnet-5-5')).toBeNull();
    expect(resolveModel('sonnet-5')).toBeNull();
    expect(resolveModel('claude-sonnet-5')).toBe('claude');
    expect(resolveModel('claude-sonnet-5-20260901')).toBe('claude');
    expect(resolveModel('claude-sonnet-4-6')).toBe('claude');
    expect(resolveModel('claude-sonnet-5-50')).toBe('claude');
    expect(resolveModel('claude-sonnet-5-5anything')).toBe('claude');
  });
});

describe('Sonnet 5.5 overlay', () => {
  test('canonical overlay includes current runtime and effort caveats', () => {
    const raw = fs.readFileSync(path.join(ROOT, 'model-overlays/sonnet-5-5.md'), 'utf-8');
    expect(raw).toContain('claude-sonnet-5-5');
    expect(raw).toContain('2.1.284');
    expect(raw).toContain('does\nnot change the runtime model');
    expect(raw).toContain('other providers and harnesses may');
    expect(raw).toContain('API defaults to high');
    expect(raw).toContain('thinking-display-updates-2026-08-18');
    expect(raw).toContain('`between_tools` accepts no display');
    expect(fs.existsSync(path.join(ROOT, 'model-overlays/sonnet-5.md'))).toBe(false);
  });

  test('inherits the claude base and stays subordinate to skill gates', () => {
    const out = generateModelOverlay(makeCtx('sonnet-5-5'));
    expect(out).toContain('Todo-list discipline');
    expect(out).toContain('subordinate');
  });

  test('carries completion and scope guidance for Sonnet 5.5', () => {
    const out = generateModelOverlay(makeCtx('sonnet-5-5'));
    expect(out).toContain('Carry requested work through');
    expect(out).toContain('Scope work to the request');
    expect(out).toContain('stop when the requested work is complete');
    expect(out).toContain('Choose effort for the task');
  });

  test('has no unresolved inheritance directive', () => {
    const out = generateModelOverlay(makeCtx('sonnet-5-5'));
    expect(out).not.toContain('{{INHERIT:');
  });

  test('base claude overlay does not acquire Sonnet 5.5 guidance', () => {
    const out = generateModelOverlay(makeCtx('claude'));
    expect(out).not.toContain('Carry requested work through');
    expect(out).not.toContain('claude-sonnet-5-5');
  });
});
