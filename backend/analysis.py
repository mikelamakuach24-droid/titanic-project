"""Small, reproducible summaries of the Titanic passenger sample."""

from pathlib import Path

import numpy as np
import pandas as pd

DATA_PATH = Path(__file__).resolve().parent / "data" / "Titanic-Dataset.csv"


def clean_data(raw):
    """Match notebook 02 without changing the original DataFrame."""
    data = raw.copy()
    data["Age"] = data["Age"].fillna(data["Age"].median())
    data["Embarked"] = data["Embarked"].fillna(data["Embarked"].mode().iloc[0])
    return data.drop(columns="Cabin")


def group_survival(data, column, order, labels):
    groups = data.groupby(column, observed=False)["Survived"]
    counts = groups.agg(["count", "sum"]).reindex(order, fill_value=0)
    return {
        "labels": labels,
        "survived": [int(value) for value in counts["sum"]],
        "not_survived": [int(value) for value in counts["count"] - counts["sum"]],
        "survival_rate": [
            (
                round(100 * float(row["sum"]) / int(row["count"]), 2)
                if row["count"]
                else 0.0
            )
            for _, row in counts.iterrows()
        ],
    }


def distribution(data, column, edges, labels):
    binned = data.assign(Bin=pd.cut(data[column], edges, labels=labels, right=False))
    grouped = group_survival(binned, "Bin", labels, labels)
    survivor = float(data.loc[data["Survived"] == 1, column].mean())
    non_survivor = float(data.loc[data["Survived"] == 0, column].mean())
    result = {
        "bins": labels,
        "survived": grouped["survived"],
        "not_survived": grouped["not_survived"],
        "avg_survivor": round(survivor, 2),
        "avg_non_survivor": round(non_survivor, 2),
    }
    if column == "Age":
        result["difference"] = round(abs(survivor - non_survivor), 2)
    return result


def get_dashboard():
    raw = pd.read_csv(DATA_PATH)
    data = clean_data(raw)
    total = int(len(data))
    survived = int(data["Survived"].sum())
    missing = raw.isna().sum()
    actions = {
        "Age": "Filled with median",
        "Embarked": "Filled with mode",
        "Cabin": "Dropped column",
    }
    missing_values = [
        {
            "column": str(column),
            "count": int(count),
            "pct": round(100 * int(count) / total, 2),
            "action": actions.get(str(column), "Kept as missing"),
        }
        for column, count in missing.items()
        if count > 0
    ]
    features = {
        "PassengerId": "Passenger ID",
        "Pclass": "Passenger class",
        "Age": "Age",
        "SibSp": "Siblings / spouses",
        "Parch": "Parents / children",
        "Fare": "Fare",
        "Female": "Gender (female=1)",
    }
    numeric = data.assign(Female=data["Sex"].map({"male": 0, "female": 1}))
    correlations = (
        numeric[list(features) + ["Survived"]].corr()["Survived"].drop("Survived")
    )
    correlation = [
        {"feature": features[column], "value": round(float(value), 4)}
        for column, value in correlations.sort_values().items()
        if pd.notna(value)
    ]
    return {
        "summary": {
            "total": total,
            "survived": survived,
            "not_survived": total - survived,
            "survival_rate": round(100 * survived / total, 2),
            "not_survival_rate": round(100 * (total - survived) / total, 2),
        },
        "missing_values": missing_values,
        "overall_survival": {
            "labels": ["Survived", "Did Not Survive"],
            "values": [survived, total - survived],
        },
        "gender": group_survival(data, "Sex", ["female", "male"], ["Female", "Male"]),
        "pclass": group_survival(data, "Pclass", [1, 2, 3], ["1st", "2nd", "3rd"]),
        "age": distribution(
            data,
            "Age",
            [0, 10, 20, 30, 40, 50, 60, 70, 80, np.inf],
            [
                "0–9",
                "10–19",
                "20–29",
                "30–39",
                "40–49",
                "50–59",
                "60–69",
                "70–79",
                "80+",
            ],
        ),
        "fare": distribution(
            data,
            "Fare",
            [0, 10, 25, 50, 100, np.inf],
            ["$0–9", "$10–24", "$25–49", "$50–99", "$100+"],
        ),
        "correlation": correlation,
    }
