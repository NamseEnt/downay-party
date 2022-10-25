import { useRef } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { Button } from '@mui/material';
import typescript from 'typescript';

export const ReactionCodeEditor: React.FC = () => {
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

    const onMount: OnMount = (editor, monaco) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
            `
            declare type DonateContext = any;
            declare type OnDonate = (context: DonateContext, message: string, amount: number) => void;
            `,
        );
        editorRef.current = editor;
    };

    const onSaveButtonClicked = () => {
        const editor = editorRef.current;
        if (!editor) {
            return;
        }

        const code = editor.getValue();
        const wrappedCode = `(() => {
                ${code}
                return onDonate;
            }
        })`;
        const transpileResult = typescript.transpile(wrappedCode);

        const getOnDonate: any = window.eval(transpileResult);
        const onDonate = getOnDonate();
        onDonate();
    };

    return (
        <>
            <Button onClick={onSaveButtonClicked} variant="contained">
                Run reaction
            </Button>

            <MonacoEditor
                height="90vh"
                defaultLanguage="typescript"
                defaultValue="const onDonate: OnDonate = (context, message, amount) => {};"
                onMount={onMount}
            />
        </>
    );
};
