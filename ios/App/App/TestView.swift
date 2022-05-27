import Foundation
import UIKit

class TestView: UIViewController {

    let lblName = UILabel()

    override func viewDidLoad() {
        super.viewDidLoad()
        lblName.text = "Name:"
        lblName.textColor = UIColor.cyan
        self.view.addSubview(lblName)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
