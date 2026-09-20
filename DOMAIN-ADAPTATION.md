# Domain adaptation note

## Original
The supplied Digital Heroes Level 1 PRD describes a subscription-driven golf performance platform using Stableford scores.

## Alternative
This implementation uses cricket as the domain:

- Stableford score → Impact Form Score
- Golf round → Cricket match
- Golf score entry → Runs + wickets + format + result entry
- Score proof → Match scorecard proof

## Why this change was made

The cricket concept is easier to understand at a glance and makes the application's primary workflow concrete: log a match, see a form signal, support a cause, and participate in the monthly reward system.

## Submission guidance

This is a deliberately disclosed requirement deviation. The original golf project remains the safer choice when strict PRD adherence is required. The cricket variant should be used when the evaluator allows domain adaptation or when demonstrating product-thinking and implementation flexibility is more valuable than literal domain compliance.
