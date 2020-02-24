export class InputManager {

    private _storedRawValue: string;

    get rawValue(): string {
        return this.htmlInput && this.htmlInput.value;
    }

    set rawValue(value: string) {
        this._storedRawValue = value;

        if (this.htmlInput) {
            this.htmlInput.value = value;
        }
    }

    get storedRawValue(): string {
        return this._storedRawValue;
    }

    constructor(private htmlInput: any) {
    }

    setCursorAt(position: number): void {
        if (this.htmlInput.setSelectionRange) {
            this.htmlInput.focus();
            if (position < 0) { position = 0; }
            this.htmlInput.setSelectionRange(position, position);
        } else if (this.htmlInput.createTextRange) {
            const textRange = this.htmlInput.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd('character', position);
            textRange.moveStart('character', position);
            textRange.select();
        }
    }

    updateValueAndCursor(newRawValue: string, oldLength: number, selectionStart: number): void {
        this.rawValue = newRawValue;
        const newLength = newRawValue.length;
        selectionStart = selectionStart - (oldLength - newLength);
        this.setCursorAt(selectionStart);
    }

    get canInputMoreNumbers(): boolean {
        const haventReachedMaxLength = !(this.rawValue.length >= this.htmlInput.maxLength && this.htmlInput.maxLength >= 0);
        const start = this.inputSelection.selectionStart;
        const end = this.inputSelection.selectionEnd;
        const haveNumberSelected = (start != end && this.htmlInput.value.substring(start, end).match(/\d/)) ? true : false;
        const startWithZero = (this.htmlInput.value.substring(0, 1) == '0');
        return haventReachedMaxLength || haveNumberSelected || startWithZero;
    }

    get inputSelection(): any {
        let selectionStart = 0;
        let selectionEnd = 0;

        if (typeof this.htmlInput.selectionStart == 'number' && typeof this.htmlInput.selectionEnd == 'number') {
            selectionStart = this.htmlInput.selectionStart;
            selectionEnd = this.htmlInput.selectionEnd;
        } else {
            const range = document.getSelection().anchorNode;

            if (range && range.firstChild == this.htmlInput) {
                const lenght = this.htmlInput.value.length;
                const normalizedValue = this.htmlInput.value.replace(/\r\n/g, '\n');
                const startRange = this.htmlInput.createTextRange();
                const endRange = this.htmlInput.createTextRange();
                endRange.collapse(false);

                if (startRange.compareEndPoints('StartToEnd', endRange) > -1) {
                    selectionStart = selectionEnd = lenght;
                } else {
                    selectionStart = -startRange.moveStart('character', -lenght);
                    selectionStart += normalizedValue.slice(0, selectionStart).split('\n').length - 1;

                    if (startRange.compareEndPoints('EndToEnd', endRange) > -1) {
                        selectionEnd = lenght;
                    } else {
                        selectionEnd = -startRange.moveEnd('character', -lenght);
                        selectionEnd += normalizedValue.slice(0, selectionEnd).split('\n').length - 1;
                    }
                }
            }
        }

        return {
            selectionStart,
            selectionEnd
        };
    }
}