CREATE TABLE tb_kanjidle (
    id SERIAL PRIMARY KEY,
    kanji TEXT NOT NULL,
    gloss TEXT[] NOT NULL,
    onyomi TEXT[] NOT NULL,
    answer TEXT NOT NULL,
    date_of_play DATE NULL
);

CREATE INDEX idx_tb_kanjidle_date_of_play
ON tb_kanjidle(date_of_play);
