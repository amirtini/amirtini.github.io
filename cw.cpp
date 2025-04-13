#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    sort(a.begin(), a.end());
    if (n%2 == 0) {
        cout << double(a[n/2 - 1] + a[n/2]) / 2;
    } else {
        cout << a[n/2];
    }
    return 0;
}



