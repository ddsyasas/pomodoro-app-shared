import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../../stores/taskStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, fontSize, borderRadius } from '../../constants/theme';
import type { TaskCategory } from '../../types';

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
}

const categories: { key: TaskCategory; label: string; emoji: string }[] = [
    { key: 'work', label: 'Work', emoji: '💼' },
    { key: 'personal', label: 'Personal', emoji: '🏠' },
    { key: 'study', label: 'Study', emoji: '📚' },
    { key: 'other', label: 'Other', emoji: '📌' },
];

// Date preset types: 0=Today, 1=Tomorrow, 2=This Week, 3=No Date, 4=Custom
const DATE_PRESET_TODAY = 0;
const DATE_PRESET_TOMORROW = 1;
const DATE_PRESET_WEEK = 2;
const DATE_PRESET_NONE = 3;
const DATE_PRESET_CUSTOM = 4;

const datePresets = [
    { label: 'Today', getDays: () => 0 },
    { label: 'Tomorrow', getDays: () => 1 },
    { label: 'This Week', getDays: () => 7 },
    { label: 'No Date', getDays: () => -1 },
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const addTask = useTaskStore((state) => state.addTask);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<TaskCategory>('work');
    const [selectedDatePreset, setSelectedDatePreset] = useState<number>(DATE_PRESET_TODAY);
    const [customDate, setCustomDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Get category color
    const getCategoryColor = (cat: TaskCategory): string => {
        switch (cat) {
            case 'work': return colors.categoryWork;
            case 'personal': return colors.categoryPersonal;
            case 'study': return colors.categoryStudy;
            case 'other': return colors.categoryOther;
        }
    };

    // Format date for display
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setCustomDate(selectedDate);
            setSelectedDatePreset(DATE_PRESET_CUSTOM);
        }
    };

    const handleSubmit = () => {
        if (!title.trim()) return;

        let dueDate: string | null = null;

        if (selectedDatePreset === DATE_PRESET_CUSTOM) {
            dueDate = customDate.toISOString().split('T')[0];
        } else if (selectedDatePreset !== DATE_PRESET_NONE) {
            const days = datePresets[selectedDatePreset].getDays();
            const date = new Date();
            date.setDate(date.getDate() + days);
            dueDate = date.toISOString().split('T')[0];
        }

        addTask(title.trim(), category, dueDate);

        // Reset form
        setTitle('');
        setCategory('work');
        setSelectedDatePreset(DATE_PRESET_TODAY);
        setCustomDate(new Date());
        onClose();
    };

    const handleClose = () => {
        setTitle('');
        setCategory('work');
        setSelectedDatePreset(DATE_PRESET_TODAY);
        setCustomDate(new Date());
        setShowDatePicker(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        >
                            <View style={[styles.modal, { backgroundColor: colors.surface }]}>
                                <View style={styles.header}>
                                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                                        Add New Task
                                    </Text>
                                    <TouchableOpacity onPress={handleClose}>
                                        <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {/* Task Title Input */}
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>
                                        Task Name
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: colors.surfaceLight,
                                                color: colors.textPrimary,
                                                borderColor: colors.border,
                                            },
                                        ]}
                                        placeholder="What do you need to do?"
                                        placeholderTextColor={colors.textMuted}
                                        value={title}
                                        onChangeText={setTitle}
                                        autoFocus
                                    />

                                    {/* Category Selection */}
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>
                                        Category
                                    </Text>
                                    <View style={styles.categoryGrid}>
                                        {categories.map((cat) => {
                                            const isSelected = category === cat.key;
                                            const catColor = getCategoryColor(cat.key);
                                            return (
                                                <TouchableOpacity
                                                    key={cat.key}
                                                    style={[
                                                        styles.categoryButton,
                                                        {
                                                            backgroundColor: isSelected ? catColor + '30' : colors.surfaceLight,
                                                            borderColor: isSelected ? catColor : colors.border,
                                                        },
                                                    ]}
                                                    onPress={() => setCategory(cat.key)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                                                    <Text
                                                        style={[
                                                            styles.categoryLabel,
                                                            { color: isSelected ? catColor : colors.textSecondary },
                                                        ]}
                                                    >
                                                        {cat.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    {/* Due Date Selection */}
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>
                                        Due Date
                                    </Text>
                                    <View style={styles.dateGrid}>
                                        {datePresets.map((preset, index) => {
                                            const isSelected = selectedDatePreset === index;
                                            return (
                                                <TouchableOpacity
                                                    key={preset.label}
                                                    style={[
                                                        styles.dateButton,
                                                        {
                                                            backgroundColor: isSelected ? colors.checkboxFilled + '30' : colors.surfaceLight,
                                                            borderColor: isSelected ? colors.checkboxFilled : colors.border,
                                                        },
                                                    ]}
                                                    onPress={() => setSelectedDatePreset(index)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.dateLabel,
                                                            { color: isSelected ? colors.checkboxFilled : colors.textSecondary },
                                                        ]}
                                                    >
                                                        {preset.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                        {/* Custom Date Button */}
                                        <TouchableOpacity
                                            style={[
                                                styles.dateButton,
                                                {
                                                    backgroundColor: selectedDatePreset === DATE_PRESET_CUSTOM ? colors.checkboxFilled + '30' : colors.surfaceLight,
                                                    borderColor: selectedDatePreset === DATE_PRESET_CUSTOM ? colors.checkboxFilled : colors.border,
                                                },
                                            ]}
                                            onPress={() => setShowDatePicker(true)}
                                            activeOpacity={0.7}
                                        >
                                            <Text
                                                style={[
                                                    styles.dateLabel,
                                                    { color: selectedDatePreset === DATE_PRESET_CUSTOM ? colors.checkboxFilled : colors.textSecondary },
                                                ]}
                                            >
                                                {selectedDatePreset === DATE_PRESET_CUSTOM ? `📅 ${formatDate(customDate)}` : '📅 Custom'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Date Picker */}
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={customDate}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleDateChange}
                                            minimumDate={new Date()}
                                        />
                                    )}
                                </ScrollView>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        { backgroundColor: colors.checkboxFilled },
                                        !title.trim() && { opacity: 0.5 },
                                    ]}
                                    onPress={handleSubmit}
                                    disabled={!title.trim()}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.submitText}>Add Task</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modal: {
        width: '100%',
        maxWidth: 400,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: '700',
    },
    closeButton: {
        fontSize: fontSize.xl,
        padding: spacing.xs,
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: '600',
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    input: {
        borderRadius: borderRadius.md,
        borderWidth: 1,
        padding: spacing.md,
        fontSize: fontSize.md,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        gap: spacing.xs,
    },
    categoryEmoji: {
        fontSize: 16,
    },
    categoryLabel: {
        fontSize: fontSize.sm,
        fontWeight: '500',
    },
    dateGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    dateButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    dateLabel: {
        fontSize: fontSize.sm,
        fontWeight: '500',
    },
    submitButton: {
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: fontSize.md,
        fontWeight: '700',
    },
});
