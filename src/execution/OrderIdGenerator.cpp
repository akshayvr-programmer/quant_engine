#include "OrderIdGenerator.h"


OrderIdGenerator::
OrderIdGenerator()

:
currentId(1)

{

}


OrderId
OrderIdGenerator::
nextId()
{
    return currentId++;
}