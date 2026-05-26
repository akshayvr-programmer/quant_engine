//
// Created by axoss-scott on 5/26/26.

//

#include "JsonExporter.h"

#include <fstream>
#include <iostream>

void JsonExporter::exportSnapshots(
    const std::vector<EngineSnapshot>& snapshots,
    const std::string& filename
)
{
    std::ofstream file(filename);

    if (!file.is_open()) {

        std::cout
            << "Failed to open JSON file."
            << std::endl;

        return;
    }

    file << "[\n";

    for (size_t i = 0; i < snapshots.size(); i++) {

        const auto& s = snapshots[i];

        file << "  {\n";

        file << "    \"timestamp\": "
             << s.timestamp << ",\n";

        file << "    \"price\": "
             << s.price << ",\n";

        file << "    \"shortMA\": "
             << s.shortMA << ",\n";

        file << "    \"longMA\": "
             << s.longMA << ",\n";

        file << "    \"zscore\": "
             << s.zscore << ",\n";

        file << "    \"action\": \""
             << s.action << "\",\n";

        file << "    \"pnl\": "
             << s.pnl << "\n";

        file << "  }";

        if (i != snapshots.size() - 1) {
            file << ",";
        }

        file << "\n";
    }

    file << "]";

    file.close();

    std::cout
        << "JSON export complete."
        << std::endl;
}
