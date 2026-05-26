//
// Created by axoss-scott on 5/26/26.
//

#pragma once

#include <vector>
#include <string>

#include "EngineSnapshot.h"

class JsonExporter {
public:
    static void exportSnapshots(const std::vector<EngineSnapshot>& snapshots, const std::string& filename);

};