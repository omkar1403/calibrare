import React, { useState, useRef } from "react";
import "./Home1.css";
import birdLogo from "./bird1.jpeg";

export const Home = () => {
    const [texts, setTexts] = useState([
        {
            id: 1,
            value: "Celebrare",
            fontSize: 16,
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            position: { x: 100, y: 100 },
        },
    ]);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    const canvasRef = useRef(null);

    const handleMouseDown = (e, id) => {
        setSelectedTextId(id);
        const text = texts.find((t) => t.id === id);
        setOffset({
            x: e.clientX - text.position.x,
            y: e.clientY - text.position.y,
        });
        setDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!dragging || selectedTextId === null) return;

        const canvas = canvasRef.current.getBoundingClientRect();
        const updatedTexts = texts.map((text) =>
            text.id === selectedTextId
                ? {
                    ...text,
                    position: {
                        x: Math.max(
                            0,
                            Math.min(e.clientX - canvas.left - offset.x, canvas.width - 150)
                        ),
                        y: Math.max(0, Math.min(e.clientY - canvas.top - offset.y, canvas.height - 50)),
                    },
                }
                : text
        );

        setTexts(updatedTexts);
    };

    const handleMouseUp = () => {
        if (dragging) {
            setHistory((prev) => [...prev, texts]);
            setRedoStack([]);
        }
        setDragging(false);
    };

    const undo = () => {
        if (history.length === 0) return;
        const prevState = history.pop();
        setRedoStack((prev) => [...prev, texts]);
        setTexts(prevState);
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const nextState = redoStack.pop();
        setHistory((prev) => [...prev, texts]);
        setTexts(nextState);
    };

    const addNewText = () => {
        const newId = texts.length ? texts[texts.length - 1].id + 1 : 1;
        const newText = {
            id: newId,
            value: "New Text",
            fontSize: 16,
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            position: { x: 50, y: 50 },
        };
        setHistory((prev) => [...prev, texts]);
        setRedoStack([]); // Clear redo stack
        setTexts([...texts, newText]);
    };

    const updateTextStyle = (id, key, value) => {
        const updatedTexts = texts.map((text) =>
            text.id === id ? { ...text, [key]: value } : text
        );
        setHistory((prev) => [...prev, texts]);
        setRedoStack([]); // Clear redo stack
        setTexts(updatedTexts);
    };

    return (
        <div
            className="home"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
          
            <header className="header">
                <div className="logo-container">
                    <img src={birdLogo} alt="Logo" className="logo" />
                    <h1 className="logo-name">Celebrare</h1>
                </div>
                <div className="controls">
                    <button onClick={undo} disabled={history.length === 0}>
                        Undo
                    </button>
                    <button onClick={redo} disabled={redoStack.length === 0}>
                        Redo
                    </button>
                </div>
            </header>

            <div className="canvas" ref={canvasRef}>
                {texts.map((text) => (
                    <div
                        key={text.id}
                        className="draggable-text"
                        style={{
                            position: "absolute",
                            left: text.position.x,
                            top: text.position.y,
                            fontSize: text.fontSize + "px",
                            fontWeight: text.fontWeight,
                            fontStyle: text.fontStyle,
                            textDecoration: text.textDecoration,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, text.id)}
                    >
                        {text.value}
                    </div>
                ))}
            </div>

           
            <div className="toolbar">
                <input
                    type="text"
                    value={texts.find((text) => text.id === selectedTextId)?.value || ""}
                    onChange={(e) =>
                        updateTextStyle(selectedTextId, "value", e.target.value)
                    }
                    placeholder="Enter text"
                />
                <select
                    value={texts.find((text) => text.id === selectedTextId)?.fontSize || 16}
                    onChange={(e) =>
                        updateTextStyle(selectedTextId, "fontSize", parseInt(e.target.value))
                    }
                >
                    {[12, 14, 16, 18, 20, 24, 28].map((size) => (
                        <option key={size} value={size}>
                            {size}px
                        </option>
                    ))}
                </select>
                <button
                    onClick={() =>
                        updateTextStyle(
                            selectedTextId,
                            "fontWeight",
                            texts.find((text) => text.id === selectedTextId)?.fontWeight ===
                                "bold"
                                ? "normal"
                                : "bold"
                        )
                    }
                >
                    B
                </button>
                <button
                    onClick={() =>
                        updateTextStyle(
                            selectedTextId,
                            "fontStyle",
                            texts.find((text) => text.id === selectedTextId)?.fontStyle ===
                                "italic"
                                ? "normal"
                                : "italic"
                        )
                    }
                >
                    I
                </button>
                <button
                    onClick={() =>
                        updateTextStyle(
                            selectedTextId,
                            "textDecoration",
                            texts.find((text) => text.id === selectedTextId)
                                ?.textDecoration === "underline"
                                ? "none"
                                : "underline"
                        )
                    }
                >
                    U
                </button>
                <button onClick={addNewText}>Add Text</button>
            </div>
        </div>
    );
};

export default Home;
