"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaMapper = void 0;
class SchemaMapper {
    fromJson(json) {
        return {
            id: json["_id"],
            collection: json["collection"],
            definition: json["definition"],
            display: json["display"],
            presentation: json["presentation"],
            repr: json["repr"],
            type: json["type"],
        };
    }
}
exports.SchemaMapper = SchemaMapper;
