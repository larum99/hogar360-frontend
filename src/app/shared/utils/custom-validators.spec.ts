    import { FormControl, FormGroup } from '@angular/forms';
    import {
    noOnlyWhitespaceValidator,
    isAdultValidator,
    pastDateValidator,
    maxOneMonthFromTodayValidator,
    passwordMatchValidator,
    withinThreeWeeksValidator,
    timeRangeValidator,
    } from './custom-validators';

    describe('Custom Validators', () => {
    describe('noOnlyWhitespaceValidator', () => {
        it('returns error if only whitespace', () => {
        const control = new FormControl('   ');
        expect(noOnlyWhitespaceValidator(control)).toEqual({
            onlyWhitespace: true,
        });
        });
        it('returns null if non-whitespace characters', () => {
        const control = new FormControl('abc ');
        expect(noOnlyWhitespaceValidator(control)).toBeNull();
        });
    });

    describe('isAdultValidator', () => {
        it('returns null if value is falsy', () => {
        const control = new FormControl(null);
        expect(isAdultValidator(control)).toBeNull();
        });

        it('returns error if invalid date', () => {
        const control = new FormControl('not-a-date');
        expect(isAdultValidator(control)).toEqual({ notAdult: true });
        });

        it('returns error if age < 18', () => {
        const today = new Date();
        const under18 = new Date(
            today.getFullYear() - 17,
            today.getMonth(),
            today.getDate() + 1
        ).toISOString();
        const control = new FormControl(under18);
        expect(isAdultValidator(control)).toEqual({ notAdult: true });
        });

        it('returns null if age >= 18', () => {
        const today = new Date();
        const over18 = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate() - 1
        ).toISOString();
        const control = new FormControl(over18);
        expect(isAdultValidator(control)).toBeNull();
        });
    });

    describe('pastDateValidator', () => {
        it('returns null if invalid date', () => {
        const control = new FormControl('invalid');
        expect(pastDateValidator(control)).toBeNull();
        });

        it('returns error if date is before today', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const control = new FormControl(yesterday.toISOString());
        expect(pastDateValidator(control)).toEqual({ pastDate: true });
        });

        it('returns null if date is today or future', () => {
        const today = new Date();
        const controlToday = new FormControl(today.toISOString());
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const controlTomorrow = new FormControl(tomorrow.toISOString());

        expect(pastDateValidator(controlToday)).toBeNull();
        expect(pastDateValidator(controlTomorrow)).toBeNull();
        });
    });

    describe('maxOneMonthFromTodayValidator', () => {
        it('returns null if invalid date', () => {
        const control = new FormControl('invalid');
        expect(maxOneMonthFromTodayValidator(control)).toBeNull();
        });

        it('returns pastDate error if date is before today', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(
            maxOneMonthFromTodayValidator(new FormControl(yesterday.toISOString()))
        ).toEqual({ pastDate: true });
        });

        it('returns maxOneMonth error if date is more than one month ahead', () => {
        const future = new Date();
        future.setMonth(future.getMonth() + 2);
        expect(
            maxOneMonthFromTodayValidator(new FormControl(future.toISOString()))
        ).toEqual({ maxOneMonth: true });
        });

        it('returns null if date is between today and one month from today', () => {
        const future = new Date();
        future.setDate(future.getDate() + 15);
        expect(
            maxOneMonthFromTodayValidator(new FormControl(future.toISOString()))
        ).toBeNull();
        });
    });

    describe('passwordMatchValidator', () => {
        it('returns null if any password field missing or empty', () => {
        const form = new FormGroup({});
        expect(passwordMatchValidator(form)).toBeNull();

        form.addControl('password', new FormControl(''));
        form.addControl('confirmPassword', new FormControl(''));
        expect(passwordMatchValidator(form)).toBeNull();
        });

        it('returns mismatch error if passwords do not match', () => {
        const form = new FormGroup({
            password: new FormControl('1234'),
            confirmPassword: new FormControl('5678'),
        });
        expect(passwordMatchValidator(form)).toEqual({ mismatch: true });
        expect(form.get('confirmPassword')?.errors).toEqual({ mismatch: true });
        });

        it('returns null and clears errors if passwords match', () => {
        const form = new FormGroup({
            password: new FormControl('1234'),
            confirmPassword: new FormControl('1234'),
        });
        form.get('confirmPassword')?.setErrors({ mismatch: true });
        expect(passwordMatchValidator(form)).toBeNull();
        expect(form.get('confirmPassword')?.errors).toBeNull();
        });
    });

    describe('withinThreeWeeksValidator', () => {
        it('returns null if invalid date', () => {
        const control = new FormControl('invalid');
        expect(withinThreeWeeksValidator(control)).toBeNull();
        });

        it('returns tooEarly error if date is before tomorrow', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const control = new FormControl(yesterday.toISOString());
        expect(withinThreeWeeksValidator(control)).toEqual({ tooEarly: true });

        const todayControl = new FormControl(today.toISOString());
        expect(withinThreeWeeksValidator(todayControl)).toEqual({
            tooEarly: true,
        });
        });

        it('returns outOfRange error if date is after 21 days from today', () => {
        const today = new Date();
        const outOfRange = new Date(today);
        outOfRange.setDate(outOfRange.getDate() + 22);
        expect(
            withinThreeWeeksValidator(new FormControl(outOfRange.toISOString()))
        ).toEqual({ outOfRange: true });
        });

        it('returns null if date is between tomorrow and 21 days from today', () => {
        const today = new Date();
        const validDate = new Date(today);
        validDate.setDate(validDate.getDate() + 10);
        expect(
            withinThreeWeeksValidator(new FormControl(validDate.toISOString()))
        ).toBeNull();
        });
    });

    describe('timeRangeValidator', () => {
        function createFormGroup(
        date: string | null,
        startTime: string | null,
        endTime: string | null
        ): FormGroup {
        return new FormGroup({
            date: new FormControl(date),
            startTime: new FormControl(startTime),
            endTime: new FormControl(endTime),
        });
        }

        it('returns null if any control is missing or falsy', () => {
        expect(timeRangeValidator(new FormGroup({}))).toBeNull();

        expect(
            timeRangeValidator(createFormGroup(null, '10:00 AM', '11:00 AM'))
        ).toBeNull();
        expect(
            timeRangeValidator(createFormGroup('2023-01-01', null, '11:00 AM'))
        ).toBeNull();
        expect(
            timeRangeValidator(createFormGroup('2023-01-01', '10:00 AM', null))
        ).toBeNull();
        });

        it('returns null if times are valid and endTime > startTime', () => {
        const group = createFormGroup('2023-01-01', '10:00 AM', '11:00 AM');
        expect(timeRangeValidator(group)).toBeNull();
        expect(group.get('endTime')?.errors).toBeNull();
        });

        it('returns error if times invalid format', () => {
        const group = createFormGroup('2023-01-01', 'invalid', '11:00 AM');
        expect(timeRangeValidator(group)).toBeNull();

        const group2 = createFormGroup('2023-01-01', '10:00 AM', 'invalid');
        expect(timeRangeValidator(group2)).toBeNull();
        });

        it('returns invalidTimeRange error if endTime <= startTime', () => {
        const group = createFormGroup('2023-01-01', '11:00 AM', '10:00 AM');
        expect(timeRangeValidator(group)).toEqual({ invalidTimeRange: true });
        expect(group.get('endTime')?.errors).toHaveProperty('invalidTimeRange');

        const group2 = createFormGroup('2023-01-01', '10:00 AM', '10:00 AM');
        expect(timeRangeValidator(group2)).toEqual({ invalidTimeRange: true });
        expect(group2.get('endTime')?.errors).toHaveProperty('invalidTimeRange');
        });

        it('clears invalidTimeRange error if range becomes valid', () => {
        const group = createFormGroup('2023-01-01', '11:00 AM', '10:00 AM');
        timeRangeValidator(group);
        expect(group.get('endTime')?.errors).toHaveProperty('invalidTimeRange');

        group.get('endTime')?.setValue('12:00 PM');
        expect(timeRangeValidator(group)).toBeNull();
        expect(group.get('endTime')?.errors).toBeNull();
        });
    });
    });
