export class CaptchaUtils {
    constructor() {
        this.mathQuestion = '';
        this.mathAnswer = 0;
        this.userAnswer = '';
        this.captchaToken = '';
        this.isVerified = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.isSubmitting = false;
        this.progress = 0;
        this.rotationClass = '';
        this.isFormSubmitting = false;
        this.submissionComplete = false;
    }

    generateMathQuestion() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operations = ['+', '*', '-'];
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];

        if (randomOperation === '-') {
            const larger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            this.mathQuestion = `What is ${larger} - ${smaller}?`;
            this.mathAnswer = larger - smaller;
        } else if (randomOperation === '+') {
            this.mathQuestion = `What is ${num1} + ${num2}?`;
            this.mathAnswer = num1 + num2;
        } else if (randomOperation === '*') {
            this.mathQuestion = `What is ${num1} * ${num2}?`;
            this.mathAnswer = num1 * num2;
        }
        this.userAnswer = '';
        this.errorMessage = '';
        this.successMessage = '';
        this.isVerified = false;
    }

    validateMathCaptcha() {
        const userResponse = parseInt(this.userAnswer);

        if (isNaN(userResponse)) {
            this.errorMessage = 'Please enter a valid number.';
            this.successMessage = '';
            this.isVerified = false;
            return false;
        }

        // Fixed: Use strict equality (===) instead of assignment (=)
        if (userResponse === this.mathAnswer) {
            this.errorMessage = '';
            this.successMessage = 'Captcha verified successfully!';
            this.isVerified = true;
            const tokenPayload = {
                question: this.mathQuestion,
                answer: this.mathAnswer,
                timestamp: Date.now()
            };
            this.captchaToken = btoa(JSON.stringify(tokenPayload));

            return true;
        } else {
            this.successMessage = '';
            this.errorMessage = 'Incorrect answer, try again.';
            this.isVerified = false;
            return false;
        }
    }

    setUserAnswer(answer) {
        this.userAnswer = answer;
        if (answer !== '' && answer !== null && answer !== undefined) {
            return this.validateMathCaptcha();
        } else {
            this.errorMessage = '';
            this.successMessage = '';
            this.isVerified = false;
            return false;
        }
    }

    startSubmission() {
        if (!this.isVerified) {
            return false;
        }

        this.isSubmitting = true;
        this.progress = 0;

        const interval = setInterval(() => {
            this.progress += 5;
            if (this.progress >= 95) {
                clearInterval(interval);
            }
        }, 100);

        return true;
    }

    startFormSubmission() {
        this.isFormSubmitting = true;
        this.isSubmitting = true;
        this.progress = 0;
        this.successMessage = 'Submitting form...';

        const interval = setInterval(() => {
            this.progress += 5;

            // Fixed: Use comparison (===) instead of assignment (=)
            if (this.progress >= 95) {
                clearInterval(interval);
            }
        }, 500);
    }

    completeSubmission() {
        this.progress = 100;
        this.isSubmitting = false;
        this.isFormSubmitting = false;
        this.submissionComplete = true;

        setTimeout(() => {
            if (this.submissionComplete) {
                this.reset();
            }
        }, 3000);
    }

    refreshQuestion() {
        if (this.isSubmitting || this.isFormSubmitting) return;

        this.rotationClass = 'rotate-[360deg]';

        setTimeout(() => {
            this.generateMathQuestion();
            this.rotationClass = '';
        }, 300);
    }

    reset() {
        this.mathQuestion = '';
        this.mathAnswer = 0;
        this.userAnswer = '';
        this.captchaToken = '';
        this.isVerified = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.isSubmitting = false;
        this.isFormSubmitting = false;
        this.progress = 0;
        this.rotationClass = '';
        this.submissionComplete = false;
    }

    getCaptchaToken() {
        return this.captchaToken;
    }

    isValid() {
        return this.isVerified && this.captchaToken !== '';
    }

    shouldKeepPopupOpen() {
        return this.isFormSubmitting || (this.isSubmitting && !this.submissionComplete);
    }

    getState() {
        return {
            mathQuestion: this.mathQuestion,
            mathAnswer: this.mathAnswer,
            userAnswer: this.userAnswer,
            captchaToken: this.captchaToken,
            isVerified: this.isVerified,
            errorMessage: this.errorMessage,
            successMessage: this.successMessage,
            isSubmitting: this.isSubmitting,
            isFormSubmitting: this.isFormSubmitting,
            progress: this.progress,
            rotationClass: this.rotationClass,
            submissionComplete: this.submissionComplete
        };
    }
}