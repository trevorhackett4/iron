// ExerciseListItem - Exercise section header with its planned sets listed below.
//
// Editing:
//   • Header "EDIT" button → Modal with reps/weight/rest fields → applies to ALL sets
//   • Tap an individual set value → native keyboard → applies to JUST that set

import React, { useRef, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import { Exercise } from "../../types";

export interface SetOverride {
  reps?: number;
  weight?: number;
  restSeconds?: number;
}

interface ExerciseListItemProps {
  exercise: Exercise;
  checkedSets: Set<number>;
  setOverrides: Record<number, SetOverride>;
  onToggleSet: (setNumber: number) => void;
  onEditSet: (
    setNumber: number,
    field: keyof SetOverride,
    value: number,
    applyToAll: boolean,
  ) => void;
  onEditAllSets: (overrides: SetOverride) => void;
}

export default function ExerciseListItem({
  exercise,
  checkedSets,
  setOverrides,
  onToggleSet,
  onEditSet,
  onEditAllSets,
}: ExerciseListItemProps) {
  const allDone = checkedSets.size >= exercise.sets;
  const setNumbers = Array.from({ length: exercise.sets }, (_, i) => i + 1);

  // Derive the "current defaults" for set 1 (representative of all sets
  // before any individual edits). The modal pre-fills from these.
  const defaultReps = setOverrides[1]?.reps ?? exercise.reps;
  const defaultWeight = setOverrides[1]?.weight ?? exercise.weight;
  const defaultRest = setOverrides[1]?.restSeconds ?? exercise.restSeconds;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* ── Exercise header ── */}
      <View style={[styles.header, allDone && styles.headerDone]}>
        <View style={styles.headerLeft}>
          <Text
            style={[styles.exerciseName, allDone && styles.exerciseNameDone]}
            allowFontScaling={false}
          >
            {exercise.name.toUpperCase()}
          </Text>
          <Text style={styles.exerciseMeta} allowFontScaling={false}>
            {exercise.sets} sets · {exercise.category.toUpperCase()}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Edit all sets button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.editButtonText} allowFontScaling={false}>
              EDIT
            </Text>
          </TouchableOpacity>

          {/* Progress counter */}
          <Text
            style={[styles.progress, allDone && styles.progressDone]}
            allowFontScaling={false}
          >
            {allDone ? "✓" : `${checkedSets.size}/${exercise.sets}`}
          </Text>
        </View>
      </View>

      {/* ── Set rows ── */}
      <View style={styles.setsContainer}>
        {setNumbers.map((setNumber) => {
          const override = setOverrides[setNumber] ?? {};
          const reps = override.reps ?? exercise.reps;
          const weight = override.weight ?? exercise.weight;
          const restSeconds = override.restSeconds ?? exercise.restSeconds;
          const isDone = checkedSets.has(setNumber);

          return (
            <SetRow
              key={setNumber}
              setNumber={setNumber}
              reps={reps}
              weight={weight}
              restSeconds={restSeconds}
              isDone={isDone}
              isLast={setNumber === exercise.sets}
              onToggle={() => onToggleSet(setNumber)}
              onEdit={(field, value) =>
                onEditSet(setNumber, field, value, false)
              }
            />
          );
        })}

        {exercise.notes ? (
          <View style={styles.coachNote}>
            <Text style={styles.coachNoteText} allowFontScaling={false}>
              ▸ {exercise.notes}
            </Text>
          </View>
        ) : null}
      </View>

      {/* ── Edit all sets modal ── */}
      <EditAllModal
        visible={modalVisible}
        exerciseName={exercise.name}
        defaultReps={defaultReps}
        defaultWeight={defaultWeight}
        defaultRest={defaultRest}
        onConfirm={(overrides) => {
          onEditAllSets(overrides);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}

// ─── SetRow ───────────────────────────────────────────────────────────────────

interface SetRowProps {
  setNumber: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  isDone: boolean;
  isLast: boolean;
  onToggle: () => void;
  onEdit: (field: keyof SetOverride, value: number) => void;
}

function SetRow({
  setNumber,
  reps,
  weight,
  restSeconds,
  isDone,
  isLast,
  onToggle,
  onEdit,
}: SetRowProps) {
  return (
    <View
      style={[
        styles.setRow,
        !isLast && styles.setRowBorder,
        isDone && styles.setRowDone,
      ]}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={styles.checkboxHitArea}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
          {isDone && (
            <Text style={styles.checkmark} allowFontScaling={false}>
              ✓
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <Text
        style={[styles.setLabel, isDone && styles.dimText]}
        allowFontScaling={false}
      >
        SET {setNumber}
      </Text>

      <View style={styles.valuesRow}>
        <EditableValue
          value={reps}
          suffix="reps"
          isDone={isDone}
          onCommit={(v) => onEdit("reps", v)}
        />

        {weight !== undefined && (
          <>
            <Text
              style={[styles.dot, isDone && styles.dimText]}
              allowFontScaling={false}
            >
              ·
            </Text>
            <EditableValue
              value={weight}
              suffix="lbs"
              isDone={isDone}
              onCommit={(v) => onEdit("weight", v)}
            />
          </>
        )}

        <Text
          style={[styles.dot, isDone && styles.dimText]}
          allowFontScaling={false}
        >
          ·
        </Text>
        <EditableValue
          value={restSeconds}
          suffix="s rest"
          isDone={isDone}
          onCommit={(v) => onEdit("restSeconds", v)}
        />
      </View>
    </View>
  );
}

// ─── EditableValue ─────────────────────────────────────────────────────────────

interface EditableValueProps {
  value: number;
  suffix: string;
  isDone: boolean;
  formatDisplay?: (v: number) => string;
  onCommit: (value: number) => void;
}

function EditableValue({
  value,
  suffix,
  isDone,
  formatDisplay,
  onCommit,
}: EditableValueProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<TextInput>(null);

  const displayText = formatDisplay
    ? formatDisplay(value)
    : `${value} ${suffix}`;

  const commitValue = () => {
    setEditing(false);
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed !== value) {
      onCommit(parsed);
    }
  };

  if (editing) {
    return (
      <View style={styles.editingContainer}>
        <TextInput
          ref={inputRef}
          style={styles.editInput}
          value={draft}
          onChangeText={setDraft}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={commitValue}
          onBlur={commitValue}
          autoFocus
          selectTextOnFocus
          allowFontScaling={false}
          maxLength={4}
        />
        <Text style={styles.editSuffix} allowFontScaling={false}>
          {suffix}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (isDone) return;
        setDraft(String(value));
        setEditing(true);
      }}
      activeOpacity={isDone ? 1 : 0.6}
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
    >
      <Text
        style={[styles.editableText, isDone && styles.dimText]}
        allowFontScaling={false}
      >
        {displayText}
      </Text>
    </TouchableOpacity>
  );
}

// ─── EditAllModal ─────────────────────────────────────────────────────────────
// GBC-styled modal for editing reps, weight, and rest across all sets.

interface EditAllModalProps {
  visible: boolean;
  exerciseName: string;
  defaultReps: number;
  defaultWeight?: number;
  defaultRest: number;
  onConfirm: (overrides: SetOverride) => void;
  onCancel: () => void;
}

function EditAllModal({
  visible,
  exerciseName,
  defaultReps,
  defaultWeight,
  defaultRest,
  onConfirm,
  onCancel,
}: EditAllModalProps) {
  const [reps, setReps] = useState(String(defaultReps));
  const [weight, setWeight] = useState(
    defaultWeight !== undefined ? String(defaultWeight) : "",
  );
  const [rest, setRest] = useState(String(defaultRest));

  // Reset draft values whenever the modal opens with new defaults
  React.useEffect(() => {
    if (visible) {
      setReps(String(defaultReps));
      setWeight(defaultWeight !== undefined ? String(defaultWeight) : "");
      setRest(String(defaultRest));
    }
  }, [visible, defaultReps, defaultWeight, defaultRest]);

  const handleConfirm = () => {
    const overrides: SetOverride = {};
    const parsedReps = parseInt(reps, 10);
    const parsedWeight = parseInt(weight, 10);
    const parsedRest = parseInt(rest, 10);

    if (!isNaN(parsedReps) && parsedReps > 0) overrides.reps = parsedReps;
    if (!isNaN(parsedWeight) && parsedWeight > 0)
      overrides.weight = parsedWeight;
    if (!isNaN(parsedRest) && parsedRest > 0)
      overrides.restSeconds = parsedRest;

    onConfirm(overrides);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Scrim */}
      <TouchableOpacity
        style={modalStyles.scrim}
        activeOpacity={1}
        onPress={onCancel}
      >
        {/* Stop scrim tap propagating into the panel */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={modalStyles.panel}>
            {/* Title bar */}
            <View style={modalStyles.titleBar}>
              <Text style={modalStyles.titleText} allowFontScaling={false}>
                {exerciseName.toUpperCase()}
              </Text>
              <Text style={modalStyles.titleSub} allowFontScaling={false}>
                EDIT ALL SETS
              </Text>
            </View>

            <View style={modalStyles.body}>
              {/* Reps field */}
              <ModalField
                label="REPS"
                value={reps}
                onChange={setReps}
                suffix="reps"
              />

              {/* Weight field — only shown if the exercise has weight */}
              {defaultWeight !== undefined && (
                <ModalField
                  label="WEIGHT"
                  value={weight}
                  onChange={setWeight}
                  suffix="lbs"
                />
              )}

              {/* Rest field */}
              <ModalField
                label="REST"
                value={rest}
                onChange={setRest}
                suffix="seconds"
              />

              {/* Actions */}
              <View style={modalStyles.actions}>
                <TouchableOpacity
                  style={[modalStyles.btn, modalStyles.btnCancel]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text
                    style={modalStyles.btnCancelText}
                    allowFontScaling={false}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[modalStyles.btn, modalStyles.btnConfirm]}
                  onPress={handleConfirm}
                  activeOpacity={0.7}
                >
                  <Text
                    style={modalStyles.btnConfirmText}
                    allowFontScaling={false}
                  >
                    APPLY TO ALL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── ModalField ───────────────────────────────────────────────────────────────

interface ModalFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
}

function ModalField({ label, value, onChange, suffix }: ModalFieldProps) {
  return (
    <View style={modalStyles.field}>
      <Text style={modalStyles.fieldLabel} allowFontScaling={false}>
        {label}
      </Text>
      <View style={modalStyles.fieldInputRow}>
        <View style={modalStyles.fieldInputBorder}>
          <TextInput
            style={modalStyles.fieldInput}
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            returnKeyType="done"
            selectTextOnFocus
            allowFontScaling={false}
            maxLength={4}
          />
        </View>
        <Text style={modalStyles.fieldSuffix} allowFontScaling={false}>
          {suffix}
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    borderRadius: 0,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.gb.lightest,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },

  headerDone: {
    backgroundColor: Colors.gb.mid,
  },

  headerLeft: {
    flex: 1,
    gap: 2,
  },

  exerciseName: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 0.5,
  },

  exerciseNameDone: {
    color: Colors.gb.dark,
  },

  exerciseMeta: {
    fontSize: FontSize.xs,
    color: Colors.gb.mid,
    letterSpacing: 0.5,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },

  editButton: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },

  editButtonText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.gold,
    letterSpacing: 1,
  },

  progress: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 1,
    minWidth: 28,
    textAlign: "right",
  },

  progressDone: {
    color: Colors.gb.green,
  },

  setsContainer: {
    backgroundColor: Colors.gb.dark,
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    gap: Spacing.sm,
    backgroundColor: Colors.gb.dark,
  },

  setRowBorder: {
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
  },

  setRowDone: {
    backgroundColor: Colors.gb.darkest,
    opacity: 0.6,
  },

  checkboxHitArea: {
    flexShrink: 0,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.mid,
    backgroundColor: Colors.gb.darkest,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },

  checkboxDone: {
    borderColor: Colors.gb.green,
  },

  checkmark: {
    fontSize: FontSize.xs,
    color: Colors.gb.green,
    fontWeight: "bold",
    lineHeight: FontSize.xs + 2,
  },

  setLabel: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.light,
    letterSpacing: 1,
    width: 40,
    flexShrink: 0,
  },

  valuesRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },

  dot: {
    fontSize: FontSize.sm,
    color: Colors.gb.mid,
  },

  dimText: {
    color: Colors.gb.mid,
  },

  editableText: {
    fontSize: FontSize.sm,
    color: Colors.gb.gold,
    letterSpacing: 0.5,
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: Colors.gb.mid,
  },

  editingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.gold,
  },

  editInput: {
    fontSize: FontSize.sm,
    color: Colors.gb.gold,
    fontWeight: "bold",
    minWidth: 32,
    maxWidth: 56,
    padding: 0,
    letterSpacing: 0.5,
  },

  editSuffix: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
    letterSpacing: 0.5,
  },

  coachNote: {
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.gb.black,
    backgroundColor: Colors.gb.darkest,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  coachNoteText: {
    fontSize: FontSize.xs,
    color: Colors.gb.blue,
    letterSpacing: 0.5,
    lineHeight: FontSize.xs * 1.6,
  },
});

const modalStyles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },

  panel: {
    width: "100%",
    maxWidth: 360,
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    borderRadius: 0,
    overflow: "hidden",
  },

  titleBar: {
    backgroundColor: Colors.gb.lightest,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    gap: 2,
  },

  titleText: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 1,
  },

  titleSub: {
    fontSize: FontSize.xs,
    color: Colors.gb.mid,
    letterSpacing: 1,
  },

  body: {
    padding: Spacing.md,
    gap: Spacing.md,
  },

  field: {
    gap: Spacing.xs,
  },

  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.light,
    letterSpacing: 1,
  },

  fieldInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  fieldInputBorder: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.darkest,
    padding: BorderWidth.thin,
  },

  fieldInput: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.gb.gold,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minWidth: 80,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.mid,
    borderRadius: 0,
    letterSpacing: 1,
  },

  fieldSuffix: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
    letterSpacing: 0.5,
  },

  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },

  btn: {
    flex: 1,
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },

  btnCancel: {
    backgroundColor: Colors.gb.dark,
    borderColor: Colors.gb.black,
  },

  btnCancelText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.light,
    letterSpacing: 1,
  },

  btnConfirm: {
    backgroundColor: Colors.gb.dark,
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.gold,
  },

  btnConfirmText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.gold,
    letterSpacing: 1,
  },
});
