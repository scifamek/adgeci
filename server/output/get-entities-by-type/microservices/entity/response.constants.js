"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_CODES_MAPPER = exports.BASE_CODE = void 0;
exports.BASE_CODE = 1000;
exports.RESPONSE_CODES_MAPPER = {
    ENTITY_SUCCESSFULLY_STORED: {
        code: 0,
        message: "The entity was stored in '{collection}' collection",
    },
    ENTITIES_BY_TYPE_FOUNDED_SUCCESSFULLY: {
        code: 5,
        message: "The entities for the '{collection}' type were founded.",
    },
    SCHEMAS_TYPE_ENTITY_SUCCESSFULLY_FOUNDED: {
        code: 10,
        message: "The schemas type entity was founded for the '{name}' enterprise.",
    },
    SCHEMA_TYPE_ENTITY_SUCCESSFULLY_FOUNDED: {
        code: 15,
        message: "The schema type entity with name {collection} was founded for the '{name}' enterprise.",
    },
};
