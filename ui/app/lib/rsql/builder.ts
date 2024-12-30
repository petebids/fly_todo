import builder from "@rsql/builder"
import {ComparisonNode, ILIKE, SEMANTICALLY_SIMILAR_TO} from "./ast";


export default {
    ...builder,
    ilike(selector: string, values: string): ComparisonNode {
        return builder.comparison(selector, ILIKE, values)
    },
    semanticallySimilarTo(selector: string, values: string): ComparisonNode {
        return builder.comparison(selector, SEMANTICALLY_SIMILAR_TO, values)
    }
}

