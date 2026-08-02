import { Box, Flex, Select, Switch, Text, TextInput } from "@sanity/ui";
import { set, setIfMissing, unset, type ObjectInputProps } from "sanity";
import {
  MONTH_LABELS,
  type ExperiencePeriod,
} from "../../src/lib/experiencePeriod";

type PeriodKey = keyof ExperiencePeriod;

export function ExperiencePeriodInput(props: ObjectInputProps) {
  const { value, onChange, readOnly } = props;
  const period = (value ?? {}) as ExperiencePeriod;

  const patch = (...patches: unknown[]) =>
    onChange([setIfMissing({}), ...patches] as Parameters<typeof onChange>[0]);

  const setValue = (key: PeriodKey, next: number | boolean | undefined) =>
    patch(next === undefined ? unset([key]) : set(next, [key]));

  const monthSelect = (key: PeriodKey, month?: number | null) => (
    <Box style={{ width: 78 }}>
      <Select
        value={month ?? ""}
        readOnly={readOnly}
        fontSize={1}
        padding={2}
        onChange={(event) =>
          setValue(key, Number(event.currentTarget.value) || undefined)
        }
      >
        <option value="" />
        {MONTH_LABELS.map((label, index) => (
          <option key={label} value={index + 1}>
            {label}
          </option>
        ))}
      </Select>
    </Box>
  );

  const yearInput = (key: PeriodKey, year?: number | null) => (
    <Box style={{ width: 72 }}>
      <TextInput
        value={year ?? ""}
        readOnly={readOnly}
        fontSize={1}
        padding={2}
        inputMode="numeric"
        placeholder="Year"
        onChange={(event) =>
          setValue(key, Number(event.currentTarget.value.trim()) || undefined)
        }
      />
    </Box>
  );

  return (
    <Flex align="center" gap={2} wrap="wrap">
      {monthSelect("startMonth", period.startMonth)}
      {yearInput("startYear", period.startYear)}

      <Text muted size={1}>
        –
      </Text>

      {period.isPresent ? (
        <Text size={1} weight="medium">
          Present
        </Text>
      ) : (
        <>
          {monthSelect("endMonth", period.endMonth)}
          {yearInput("endYear", period.endYear)}
        </>
      )}

      <Flex align="center" gap={2} paddingLeft={3}>
        <Switch
          checked={Boolean(period.isPresent)}
          readOnly={readOnly}
          onChange={(event) =>
            event.currentTarget.checked
              ? patch(set(true, ["isPresent"]), unset(["endMonth"]), unset(["endYear"]))
              : setValue("isPresent", undefined)
          }
        />
        <Text size={1} muted>
          Present
        </Text>
      </Flex>
    </Flex>
  );
}
