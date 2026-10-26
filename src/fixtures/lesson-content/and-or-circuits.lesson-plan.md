# Lesson plan

**Grade band:** 9–12 &nbsp;·&nbsp; **Time:** 2 × 45 minutes &nbsp;·&nbsp; **Grouping:** pairs

## Overview

Students wire switches in **series** and in **parallel**, watch when a lamp lights, and turn what they see into the truth tables for **AND** and **OR** logic. By the end they can explain why a chip full of tiny switches can make decisions.

> **Big idea:** a series circuit behaves like AND (every switch must be closed). A parallel circuit behaves like OR (any one closed switch is enough).

## Learning objectives

By the end of the lesson, students can:

1. Build a series circuit and a parallel circuit from the same parts.
2. Predict whether the lamp lights for every combination of open and closed switches.
3. Record their observations in a truth table and name the pattern *AND* or *OR*.
4. Explain, in a sentence, how digital hardware is built from many of these decisions.

## Before class

- [x] Print one worksheet per pair
- [x] Label switches **A** and **B** with tape
- [ ] Test every battery pack — dim lamps usually mean tired cells
- [ ] Queue the opening video on the projector

## Materials

| Item | Per pair | Notes |
| --- | :---: | --- |
| Battery pack (3 V) | 1 | Fresh cells, please |
| Toggle switches | 2 | Labeled **A** and **B** |
| Lamp and holder | 1 | |
| Alligator-clip leads | 6 | Mixed colors help students trace paths |
| Worksheet | 1 | Printed or on a tablet |

## Series circuit

![Two switches wired one after the other with a lamp](series-circuit.svg)

With the switches wired one after the other, current has a single path. If either switch is open, the path is broken and the lamp stays dark. Ask students to *predict before they flip anything*.

## Parallel circuit

![Two switches on separate branches feeding one lamp](parallel-circuit.svg)

Now each switch has its own branch. Closing either one completes a path to the lamp, so the lamp lights if **A**, **B**, or both are closed.

## The truth tables students should reach

| Switch A | Switch B | Series lamp (AND) | Parallel lamp (OR) |
| :---: | :---: | :---: | :---: |
| open | open | off | off |
| open | closed | off | **on** |
| closed | open | off | **on** |
| closed | closed | **on** | **on** |

Hold this table back until students have filled in their own from observation.

## Pacing

| Minutes | Activity | Grouping |
| ---: | --- | --- |
| 5 | Hook: how does a calculator "decide" anything? | Whole class |
| 10 | Build and test the series circuit | Pairs |
| 10 | Build and test the parallel circuit | Pairs |
| 10 | Complete the truth tables and name the patterns | Pairs |
| 10 | Share out and connect to logic gates | Whole class |

## Discussion questions

- What happens to the lamp if one switch in the **series** circuit is open? Why?
- Where could you add a third switch so the lamp needs *all three* to light? *Any one* of three?
- A security light turns on only when it is dark **and** motion is detected. Which circuit does that need?

## Assessment

> **Exit ticket:** Draw a circuit where the lamp lights only when switch A is closed **and** switch B is closed. Label which logic gate it matches.

Look for: a single path (series), correct switch labels, and the word *AND*.

## Differentiation

- **Support:** give students a partly wired circuit and have them complete it.
- **Extend:** hand pairs a third switch and ask for a circuit that lights when A and B are both closed, *or* when the third switch is closed alone. (A series pair in parallel with a single switch.)
